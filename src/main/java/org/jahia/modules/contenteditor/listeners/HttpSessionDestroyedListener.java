package org.jahia.modules.contenteditor.listeners;

import org.jahia.api.Constants;
import org.jahia.bin.filters.jcr.JcrSessionFilter;
import org.jahia.bin.listeners.JahiaContextLoaderListener;
import org.jahia.modules.contenteditor.api.lock.StaticEditorLockService;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.usermanager.JahiaUser;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;

import javax.servlet.http.HttpSession;

/**
 * This code is mostly a copy of the GWT equivalent org.jahia.ajax.gwt.helper.LocksHelper
 */
public class HttpSessionDestroyedListener implements ApplicationListener<ApplicationEvent> {


    @Override
    public void onApplicationEvent(ApplicationEvent applicationEvent) {
        if (applicationEvent instanceof JahiaContextLoaderListener.HttpSessionDestroyedEvent) {
            HttpSession httpSession = ((JahiaContextLoaderListener.HttpSessionDestroyedEvent) applicationEvent).getSession();
            if (httpSession.getAttribute(Constants.SESSION_USER) != null) {
                if (JCRSessionFactory.getInstance().getCurrentUser() != null) {
                    StaticEditorLockService.closeAllRemainingLocks(httpSession);
                } else {
                    try {
                        JCRSessionFactory.getInstance().setCurrentUser((JahiaUser) httpSession.getAttribute(Constants.SESSION_USER));
                        StaticEditorLockService.closeAllRemainingLocks(httpSession);
                    } finally {
                        JcrSessionFilter.endRequest();
                    }
                }
            }
        }
    }
}
