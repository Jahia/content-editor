package org.jahia.modules.contenteditor.api.lock;

import org.apache.commons.lang3.StringUtils;
import org.jahia.api.Constants;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.UnsupportedRepositoryOperationException;
import javax.jcr.lock.LockException;
import javax.jcr.security.Privilege;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

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
    private static final String LOCKS_SESSION_ATTR = "contentEditorLocks";

    /**
     * Lock the node for edition and store the lock info in session for cleanup
     *
     * @param request the current request
     * @param nodePath the node to lock
     * @param lockId the lockID to store the lock info in session
     * @return true if the node is successfully locked, false if the node doesnt support locks
     * @throws RepositoryException
     */
    public static boolean tryLock(HttpServletRequest request, String nodePath, String lockId) throws RepositoryException {
        JCRSessionWrapper sessionWrapper = JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE);
        JCRNodeWrapper node = sessionWrapper.getNode(nodePath);

        if (node.getProvider().isLockingAvailable() && node.hasPermission(Privilege.JCR_LOCK_MANAGEMENT)) {
            try {

                // session locks data
                HashMap<String, String> locks = getSessionLocks(request.getSession());
                locks.put(lockId, node.getIdentifier());
                request.getSession().setAttribute(LOCKS_SESSION_ATTR, locks);

                // jcr lock
                node.lockAndStoreToken(LOCK_TYPE);

                return true;
            } catch (UnsupportedRepositoryOperationException e) {
                // do nothing if lock is not supported
            }
        }
        return false;
    }

    /**
     * unlock the node for edition if it's locked, clean the session info about locks
     * @param request the current request
     * @param lockId the lockID to store the lock info in session
     * @throws RepositoryException
     */
    public static void unlock(HttpServletRequest request, String lockId) throws RepositoryException {
        JCRSessionWrapper sessionWrapper = JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE);
        HashMap<String, String> locks = getSessionLocks(request.getSession(false));
        String lockedIdentifier = locks.get(lockId);

        if (lockedIdentifier != null) {
            // always remove session locks data
            locks.remove(lockId);

            JCRNodeWrapper node = sessionWrapper.getNodeByIdentifier(lockedIdentifier);
            if (!locks.containsValue(lockedIdentifier) && // unlock JCR only if there is no other lock on this UUID already in session
                node.getProvider().isLockingAvailable() &&
                node.isLocked()) {

                String lockOwners = node.getLockOwner();
                if (StringUtils.isNotEmpty(lockOwners) &&
                    Arrays.asList(StringUtils.split(lockOwners, " ")).contains(JCRSessionFactory.getInstance().getCurrentUser().getUsername())) {

                    node.unlock(LOCK_TYPE);
                }
            }
        }
    }

    /**
     * In case session is destroyed this function can be used to clean all remaining editor locks for this session
     * @param httpSession the http session
     */
    public static void closeAllRemainingLocks(HttpSession httpSession) {
        closeAllLocks(getSessionLocks(httpSession).values());
    }

    private static HashMap<String, String> getSessionLocks(HttpSession session) {
        if (session != null) {
            @SuppressWarnings("unchecked") HashMap<String, String> locks = (HashMap<String, String>) session.getAttribute(LOCKS_SESSION_ATTR);
            if (locks != null) {
                return locks;
            }
        }
        return new HashMap<>();
    }

    /**
     * Copy of GWT: org.jahia.ajax.gwt.helper.LocksHelper.closeAllLocks
     * @param locks
     */
    private static void closeAllLocks(Collection<String> locks) {
        try {
            for (String lock : locks) {
                JCRSessionWrapper jcrsession = JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE);
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
            locks.clear();
        } catch (RepositoryException e) {
            logger.error("Cannot release locks", e);
        }
    }
}
