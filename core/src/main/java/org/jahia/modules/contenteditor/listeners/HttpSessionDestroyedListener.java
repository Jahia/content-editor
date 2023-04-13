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
                JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
                JahiaUser currentUser = jcrSessionFactory.getCurrentUser();
                if (currentUser != null) {
                    StaticEditorLockService.closeAllRemainingLocks();
                } else {
                    try {
                        jcrSessionFactory.setCurrentUser((JahiaUser) httpSession.getAttribute(Constants.SESSION_USER));
                        StaticEditorLockService.closeAllRemainingLocks();
                    } finally {
                        JcrSessionFilter.endRequest();
                    }
                }
            }
        }
    }
}
