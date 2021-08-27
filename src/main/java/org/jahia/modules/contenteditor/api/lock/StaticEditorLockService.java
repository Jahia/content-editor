package org.jahia.modules.contenteditor.api.lock;

import org.apache.commons.lang3.StringUtils;
import org.jahia.api.Constants;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.usermanager.JahiaUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
 *
 */
public class StaticEditorLockService {

    private static final Logger logger = LoggerFactory.getLogger(StaticEditorLockService.class);

    private static final String LOCK_TYPE = "engine";
    private static final String LOCK_SYNC_PREFIX = "content-editor-";

    private static final Map<JahiaUser, Map<String, String>> holdLocks = new ConcurrentHashMap<>();

    /**
     * Lock the node for edition and store the lock info in session for cleanup
     *
     * @param nodePath the node to lock
     * @param lockId the lockID to store the lock info in session
     * @return true if the node is successfully locked, false if the node doesnt support locks
     * @throws RepositoryException
     */
    public static boolean tryLock(String nodePath, String lockId) throws RepositoryException {
        synchronized ((LOCK_SYNC_PREFIX + lockId).intern()) {
            JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
            JahiaUser currentUser = jcrSessionFactory.getCurrentUser();
            JCRSessionWrapper sessionWrapper = jcrSessionFactory.getCurrentUserSession(Constants.EDIT_WORKSPACE);
            JCRNodeWrapper node = sessionWrapper.getNode(nodePath);

            if (node.getProvider().isLockingAvailable() && node.hasPermission(Privilege.JCR_LOCK_MANAGEMENT)) {
                try {

                    // session locks data
                    Map<String, String> locks = holdLocks.containsKey(currentUser) ? holdLocks.get(currentUser) : new HashMap<>();
                    locks.put(lockId, node.getIdentifier());
                    holdLocks.put(currentUser, locks);

                    // jcr lock
                    node.lockAndStoreToken(LOCK_TYPE);
                    // release the session lock token to avoid concurrency issues between session doing lock/unlock at the same time
                    for (String lockToken : sessionWrapper.getLockTokens()) {
                        sessionWrapper.removeLockToken(lockToken);
                    }

                    return true;
                } catch (UnsupportedRepositoryOperationException e) {
                    // do nothing if lock is not supported
                }
            }
            return false;
        }
    }

    /**
     * unlock the node for edition if it's locked, clean the session info about locks
     * @param lockId the lockID to store the lock info in session
     * @throws RepositoryException
     */
    public static void unlock(String lockId) throws RepositoryException {
        synchronized ((LOCK_SYNC_PREFIX + lockId).intern()) {
            JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
            JahiaUser currentUser = jcrSessionFactory.getCurrentUser();
            if (!holdLocks.containsKey(currentUser)) {
                // no locks found for current user
                return;
            }

            JCRSessionWrapper sessionWrapper = jcrSessionFactory.getCurrentUserSession(Constants.EDIT_WORKSPACE);
            Map<String, String> locks = holdLocks.get(currentUser);
            String lockedIdentifier = locks.get(lockId);

            if (lockedIdentifier != null) {
                // always remove session locks data
                locks.remove(lockId);
                holdLocks.put(currentUser, locks);

                JCRNodeWrapper node = sessionWrapper.getNodeByIdentifier(lockedIdentifier);
                if (!locks.containsValue(lockedIdentifier) && // unlock JCR only if there is no other lock on this UUID already in session
                    node.getProvider().isLockingAvailable() &&
                    node.isLocked()) {

                    String lockOwners = node.getLockOwner();
                    if (StringUtils.isNotEmpty(lockOwners) &&
                        Arrays.asList(StringUtils.split(lockOwners, " ")).contains(currentUser.getUsername())) {
                        node.unlock(LOCK_TYPE);
                    }
                }
            }
        }
    }

    /**
     * In case session is destroyed this function can be used to clean all remaining editor locks for this session
     */
    public static void closeAllRemainingLocks() {
        JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
        JahiaUser currentUser = jcrSessionFactory.getCurrentUser();

        if (!holdLocks.containsKey(currentUser)) {
            // no lock for current user
            return;
        }

        try {
            for (String lock : holdLocks.get(currentUser).values()) {
                JCRSessionWrapper jcrsession = jcrSessionFactory.getCurrentUserSession(Constants.EDIT_WORKSPACE);
                try {
                    JCRNodeWrapper node = jcrsession.getNodeByUUID(lock);
                    node.unlock(LOCK_TYPE);
                } catch (LockException e) {
                    // We still want other nodes to get unlocked, so just log and not re-throw.
                    logger.warn("Problem while trying to unlock node: " + lock + " - " + e);
                } catch (Exception e) {
                    // We still want other nodes to get unlocked, so just log and not re-throw.
                    logger.error("Unexpected problem while trying to unlock node - node may remain locked: " + lock, e);
                }
            }
            holdLocks.remove(currentUser);
        } catch (RepositoryException e) {
            logger.error("Cannot release locks", e);
        }
    }
}
