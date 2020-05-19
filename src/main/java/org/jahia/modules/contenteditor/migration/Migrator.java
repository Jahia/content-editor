/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2020 Jahia Solutions Group SA. All rights reserved.
 *
 *     THIS FILE IS AVAILABLE UNDER TWO DIFFERENT LICENSES:
 *     1/GPL OR 2/JSEL
 *
 *     1/ GPL
 *     ==================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE GPL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 *     2/ JSEL - Commercial and Supported Versions of the program
 *     ===================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE JSEL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     Alternatively, commercial and supported versions of the program - also known as
 *     Enterprise Distributions - must be used in accordance with the terms and conditions
 *     contained in a separate written agreement between you and Jahia Solutions Group SA.
 *
 *     If you are unsure which license is appropriate for your use,
 *     please contact the sales department at sales@jahia.com.
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
