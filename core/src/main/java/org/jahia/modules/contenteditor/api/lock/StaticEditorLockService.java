/*
 * MIT License
 *
 * Copyright (c) 2002 - 2022 Jahia Solutions Group. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package org.jahia.modules.contenteditor.api.lock;

import org.apache.commons.lang3.StringUtils;
import org.jahia.api.Constants;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.usermanager.JahiaUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.touk.throwing.ThrowingBiFunction;
import pl.touk.throwing.ThrowingConsumer;
import pl.touk.throwing.exception.WrappedException;

import javax.jcr.RepositoryException;
import javax.jcr.UnsupportedRepositoryOperationException;
import javax.jcr.lock.LockException;
import javax.jcr.security.Privilege;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Main class for locking operation of editors
 * it's mostly code based on existing GWT code that you can find in:
 * org.jahia.ajax.gwt.helper.LocksHelper
 * org.jahia.ajax.gwt.content.server.JahiaContentManagementServiceImpl.addEngineLock()
 * org.jahia.ajax.gwt.content.server.JahiaContentManagementServiceImpl.closeEditEngine()
 */
public class StaticEditorLockService {

    private static final Logger logger = LoggerFactory.getLogger(StaticEditorLockService.class);

    private static final String LOCK_TYPE = "engine";

    private static final Map<String, LockDetails> holdLocks = new ConcurrentHashMap<>();
    private static final Map<String, Set<String>> locksByUuid = new ConcurrentHashMap<>();

    /**
     * Lock the node for edition and store the lock info in session for cleanup
     *
     * @param uuid   the node to lock
     * @param lockId the lockID to store the lock info in session
     * @return true if the node is successfully locked, false if the node doesnt support locks
     * @throws RepositoryException
     */
    public static boolean tryLock(String uuid, String lockId) throws RepositoryException {
        JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
        JahiaUser currentUser = jcrSessionFactory.getCurrentUser();
        JCRSessionWrapper sessionWrapper = jcrSessionFactory.getCurrentUserSession(Constants.EDIT_WORKSPACE);
        JCRNodeWrapper node = sessionWrapper.getNodeByIdentifier(uuid);

        logger.debug("Trying to add lock {} on node {}", lockId, uuid);

        try {
            LockDetails r = holdLocks.compute(lockId, (k, lockDetails) -> {
                if (node.getProvider().isLockingAvailable() && node.hasPermission(Privilege.JCR_LOCK_MANAGEMENT)) {
                    locksByUuid.compute(uuid, ThrowingBiFunction.unchecked((lockedIdentifier, locks) -> {
                        if (locks == null) {
                            locks = new HashSet<>();
                        }

                        if (locks.isEmpty()) {
                            logger.debug("Locking node {}", lockedIdentifier);
                            // jcr lock
                            node.lockAndStoreToken(LOCK_TYPE);
                            // release the session lock token to avoid concurrency issues between session doing lock/unlock at the same time
                            for (String lockToken : sessionWrapper.getLockTokens()) {
                                sessionWrapper.removeLockToken(lockToken);
                            }
                        }

                        locks.add(lockId);
                        logger.debug("Locks set on node {} : {}", lockedIdentifier, locks);

                        return locks;
                    }));

                    // session locks data
                    return new LockDetails(currentUser, uuid);
                }
                return lockDetails;
            });

            return (r != null && currentUser.equals(r.user));
        } catch (WrappedException e) {
            // do nothing if lock is not supported, otherwise throw exception
            if (!(e.getCause() instanceof UnsupportedRepositoryOperationException)) {
                unwrapException(e);
            }
        }
        return false;
    }

    /**
     * unlock the node for edition if it's locked, clean the session info about locks
     *
     * @param lockId the lockID to store the lock info in session
     * @throws RepositoryException
     */
    public static void unlock(String lockId) throws RepositoryException {
        try {
            holdLocks.compute(lockId, (k, lockDetails) -> {
                JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
                JahiaUser currentUser = jcrSessionFactory.getCurrentUser();
                if (lockDetails == null || !currentUser.equals(lockDetails.user)) {
                    return lockDetails;
                }

                logger.debug("Releasing content editor lock {}", lockId);
                locksByUuid.compute(lockDetails.uuid, ThrowingBiFunction.unchecked((lockedIdentifier, locks) -> {
                    JCRSessionWrapper sessionWrapper = jcrSessionFactory.getCurrentUserSession(Constants.EDIT_WORKSPACE);
                    if (locks != null) {
                        locks.remove(lockId);
                        logger.debug("Remaining locks on node {} : {}", lockedIdentifier, locks);
                        if (locks.isEmpty()) {
                            locks = null;
                        }
                    }

                    try {
                        JCRNodeWrapper node = sessionWrapper.getNodeByIdentifier(lockedIdentifier);
                        if (locks == null && node.getProvider().isLockingAvailable() && node.isLocked()) {
                            String lockOwners = node.getLockOwner();
                            if (StringUtils.isNotEmpty(lockOwners) &&
                                Arrays.asList(StringUtils.split(lockOwners, " ")).contains(currentUser.getUsername())) {
                                logger.debug("Calling unlock on node {}", lockedIdentifier);
                                node.unlock(LOCK_TYPE);
                            }
                        }
                    } catch (LockException e) {
                        logger.warn("Error when releasing lock: {}", lockId, e);
                    }

                    return locks;
                }));

                logger.debug("Lock {} released", lockId);
                return null;
            });
        } catch (WrappedException e) {
            unwrapException(e);
        }
    }

    /**
     * In case session is destroyed this function can be used to clean all remaining editor locks for this session
     */
    public static void closeAllRemainingLocks() {
        logger.debug("Releasing all locks for current user");
        holdLocks.keySet().forEach(ThrowingConsumer.unchecked(StaticEditorLockService::unlock));
    }

    private static void unwrapException(WrappedException e) throws RepositoryException {
        if (e.getCause() instanceof RepositoryException) {
            throw (RepositoryException) e.getCause();
        } else if (e.getCause() instanceof RuntimeException) {
            throw (RuntimeException) e.getCause();
        } else if (e.getCause() instanceof Error) {
            throw (Error) e.getCause();
        }
        throw e;
    }


    private static class LockDetails {
        final JahiaUser user;
        final String uuid;

        public LockDetails(JahiaUser user, String uuid) {
            this.user = user;
            this.uuid = uuid;
        }
    }
}
