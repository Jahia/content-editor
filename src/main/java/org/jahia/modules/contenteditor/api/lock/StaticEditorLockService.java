package org.jahia.modules.contenteditor.api.lock;

import org.jahia.api.Constants;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.utils.LanguageCodeConverters;
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
     * @param locale the locale to lock
     * @param lockId the lockID to store the lock info in session
     * @return true if the node is successfully locked, false if the node doesnt support locks
     * @throws RepositoryException
     */
    public static boolean tryLock(HttpServletRequest request, String nodePath, Locale locale, String lockId) throws RepositoryException {
        JCRSessionWrapper sessionWrapper = JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE, locale);
        JCRNodeWrapper node = sessionWrapper.getNode(nodePath);

        if (node.getProvider().isLockingAvailable() && node.hasPermission(Privilege.JCR_LOCK_MANAGEMENT)) {
            try {
                // jcr lock
                node.lockAndStoreToken(LOCK_TYPE);
                lockRelatedNodes(node);

                // session locks data
                Map<String, List<String>> locks = getSessionLocks(request.getSession());
                List<String> l = locks.computeIfAbsent(lockId, k -> new ArrayList<>());
                l.add(locale + "/" + node.getIdentifier());
                request.getSession().setAttribute(LOCKS_SESSION_ATTR, locks);

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
     * @param nodePath the node to unlock
     * @param locale the locale to unlock
     * @param lockId the lockID to store the lock info in session
     * @throws RepositoryException
     */
    public static void unlock(HttpServletRequest request, String nodePath, Locale locale, String lockId) throws RepositoryException {
        JCRSessionWrapper sessionWrapper = JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE, locale);
        JCRNodeWrapper node = sessionWrapper.getNode(nodePath);

        if (node.getProvider().isLockingAvailable() && node.isLocked() && node.getLockOwner().equals(JCRSessionFactory.getInstance().getCurrentUser().getUsername())) {

            Map<String, List<String>> locks = getSessionLocks(request.getSession());
            if (locks.get(lockId) != null) {
                // unlock JCR
                node.unlock(LOCK_TYPE);
                unlockRelatedNodes(node);

                // update session locks data
                locks.get(lockId).remove(locale + "/" + node.getIdentifier());
            }
        }
    }

    /**
     * In case session is destroyed this function can be used to clean all remaining editor locks for this session
     * @param httpSession the http session
     */
    public static void closeAllRemainingLocks(HttpSession httpSession) {
        for (List<String> list : getSessionLocks(httpSession).values()) {
            closeAllLocks(list);
        }
    }

    private static Map<String, List<String>> getSessionLocks(HttpSession session) {
        @SuppressWarnings("unchecked") Map<String, List<String>> locks = (Map<String, List<String>>) session.getAttribute(LOCKS_SESSION_ATTR);
        if (locks == null) {
            locks = new HashMap<>();
        }
        return locks;
    }

    /**
     * Copy of GWT: org.jahia.ajax.gwt.helper.LocksHelper.closeAllLocks
     * @param locks
     */
    private static void closeAllLocks(List<String> locks) {
        try {
            for (String lock : locks) {
                String[] vals = lock.split("/");
                String localeForLock = vals[0];
                String lockedNodeId = vals[1];
                JCRSessionWrapper jcrsession = JCRSessionFactory.getInstance().getCurrentUserSession(null, LanguageCodeConverters.languageCodeToLocale(localeForLock));
                try {
                    JCRNodeWrapper node = jcrsession.getNodeByUUID(lockedNodeId);
                    node.unlock(LOCK_TYPE);
                    unlockRelatedNodes(node);
                } catch (LockException e) {
                    // We still want other nodes to get unlocked, so just log and not re-throw.
                    logger.warn("Problem while trying to unlock node: " + lockedNodeId + " - " + e);
                } catch (Exception e) {
                    // We still want other nodes to get unlocked, so just log and not re-throw.
                    logger.error("Unexpected problem while trying to unlock node - node may remain locked: " + lockedNodeId, e);
                }
            }
            locks.clear();
        } catch (RepositoryException e) {
            logger.error("Cannot release locks", e);
        }
    }

    /**
     * Copy of GWT org.jahia.ajax.gwt.helper.GWTResourceBundleUtils.lock()
     */
    private static void lockRelatedNodes(JCRNodeWrapper node) {
        try {
            boolean isFile;
            if (!(isFile = node.isNodeType(Constants.JAHIANT_RESOURCEBUNDLE_FILE))
                && !node.isNodeType(Constants.JAHIANT_RESOURCEBUNDLE_FOLDER)) {
                return;
            }

            final JCRNodeWrapper parent = isFile ? node.getParent() : node;
            List<JCRNodeWrapper> rbFileNodes = JCRContentUtils.getChildrenOfType(
                parent, Constants.JAHIANT_RESOURCEBUNDLE_FILE);
            for (JCRNodeWrapper rbFileNode : rbFileNodes) {
                rbFileNode.lockAndStoreToken(LOCK_TYPE);
            }
            parent.lockAndStoreToken(LOCK_TYPE);
        } catch (RepositoryException e) {
            logger.error(e.getMessage(), e);
        }

        return;
    }

    /**
     * Copy of GWT org.jahia.ajax.gwt.helper.GWTResourceBundleUtils.unlock()
     */
    private static void unlockRelatedNodes(JCRNodeWrapper node) {
        try {
            boolean isFile;
            if (!(isFile = node.isNodeType(Constants.JAHIANT_RESOURCEBUNDLE_FILE))
                && !node.isNodeType(Constants.JAHIANT_RESOURCEBUNDLE_FOLDER)) {
                return;
            }

            final JCRNodeWrapper parent = isFile ? node.getParent() : node;
            List<JCRNodeWrapper> rbFileNodes = JCRContentUtils.getChildrenOfType(
                parent, Constants.JAHIANT_RESOURCEBUNDLE_FILE);
            for (JCRNodeWrapper rbFileNode : rbFileNodes) {
                if (rbFileNode.isLocked()) {
                    rbFileNode.unlock(LOCK_TYPE);
                }
            }
            if (parent.isLocked()) {
                parent.unlock(LOCK_TYPE);
            }
        } catch (RepositoryException e) {
            logger.error(e.getMessage(), e);
        }
    }
}
