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
package org.jahia.modules.contenteditor.migration;

import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRPropertyWrapper;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.JCRValueWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Migrator for content editor, will be called by the Activator to migrate JCR data at module startup
 */
public class Migrator {
    private static final Logger logger = LoggerFactory.getLogger(Migrator.class);

    /**
     * Do the required migrations
     */
    public static void migrate() {
        try {
            logger.info("Content editor migration: start migration check for [contentEditor] permission on editor-in-chief/currentSite-access role");
            if (migrateRemoveContentEditorPermissionOnEditorInChiefCurrentSite()) {
                logger.info("Content editor migration: [contentEditor] permission successfully removed on editor-in-chief/currentSite-access role");
            } else {
                logger.info("Content editor migration: nothing to migrate for [contentEditor] permission on editor-in-chief/currentSite-access role");
            }
        } catch (Exception e) {
            logger.error("Content editor migration: Failed to migrate [contentEditor] permission on editor-in-chief/currentSite-access role", e);
        }
    }

    private static boolean migrateRemoveContentEditorPermissionOnEditorInChiefCurrentSite() throws RepositoryException {
        return JCRTemplate.getInstance().doExecuteWithSystemSession(session -> {
            JCRNodeWrapper editorInChiefCurrentSiteAccessNode;
            JCRPropertyWrapper permissionNamesProp;

            try {
                editorInChiefCurrentSiteAccessNode = session.getNode("/roles/editor/editor-in-chief/currentSite-access");
                permissionNamesProp = editorInChiefCurrentSiteAccessNode.getProperty("j:permissionNames");
            } catch (Exception e) {
                // node or property doest exist do nothing
                return false;
            }

            // Check if property contains "contentEditor" and remove it if it's the case.
            JCRValueWrapper[] originalValues = permissionNamesProp.getValues();
            if (originalValues.length > 0) {
                List<JCRValueWrapper> filteredValues = Arrays.stream(originalValues).filter(value -> {
                    try {
                        return !"contentEditor".equals(value.getString());
                    } catch (RepositoryException e) {
                        throw new RuntimeException(e);
                    }
                }).collect(Collectors.toList());

                if (originalValues.length != filteredValues.size()) {
                    permissionNamesProp.setValue(filteredValues.toArray(new JCRValueWrapper[]{}));
                    session.save();
                    return true;
                }
            }

            return false;
        });
    }
}
