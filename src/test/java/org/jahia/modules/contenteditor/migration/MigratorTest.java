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

import org.jahia.api.Constants;
import org.jahia.services.content.*;
import org.jahia.test.framework.AbstractJUnitTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

import javax.jcr.RepositoryException;
import java.util.Locale;

public class MigratorTest extends AbstractJUnitTest {
    private JCRSessionWrapper session;

    @Before
    public void beforeEach() throws Exception {
        // init sessions
        session = JCRSessionFactory.getInstance().getCurrentSystemSession(Constants.EDIT_WORKSPACE, Locale.ENGLISH, Locale.ENGLISH);
        initNodes();
    }

    @After
    public void afterEach() throws Exception {
        JCRSessionFactory.getInstance().closeAllSessions();
    }

    @Test
    public void testRemovingForContentEditorPermission() throws Exception {
        Migrator.migrate();
        session.refresh(false);
        assertTrue(assertRemovingContentEditorPermissionComplete(true));
    }

    @Test
    public void testRemovingForContentEditorPermissionWhenNodeDoesntExist() throws Exception {
        // first delete the node
        session.getNode("/roles/editor/editor-in-chief/currentSite-access").remove();
        session.save();

        // migrate
        Migrator.migrate();
        session.refresh(false);
        assertTrue(assertRemovingContentEditorPermissionComplete(false));
    }

    @Test
    public void testRemovingForContentEditorPermissionWhenPropertyDoesntExist() throws Exception {
        // first delete the property
        session.getNode("/roles/editor/editor-in-chief/currentSite-access").getProperty("j:permissionNames").remove();
        session.save();

        // migrate
        Migrator.migrate();
        session.refresh(false);
        assertTrue(assertRemovingContentEditorPermissionComplete(false));
    }

    private void initNodes() throws RepositoryException {
        JCRNodeWrapper roleNode;
        try {
            roleNode = session.getNode("/roles/editor/editor-in-chief/currentSite-access");
        } catch (Exception e) {
            roleNode = session.getNode("/roles/editor/editor-in-chief").addNode("currentSite-access", "jnt:externalPermissions");
            roleNode.setProperty("j:path", "currentSite");
        }

        roleNode.setProperty("j:permissionNames", new String[]{"jContent", "contentEditor"});
        session.save();
    }

    private boolean assertRemovingContentEditorPermissionComplete(boolean dataToMigrateExists) throws RepositoryException {
        JCRNodeWrapper roleNode;
        JCRPropertyWrapper property;

        try {
            roleNode = session.getNode("/roles/editor/editor-in-chief/currentSite-access");
            property = roleNode.getProperty("j:permissionNames");
        } catch (Exception e) {
            // Data doesnt exist, nothing to migrate
            return !dataToMigrateExists;
        }

        // The only value that should stay after migration is jContent
        JCRValueWrapper[] values = property.getValues();
        return values.length == 1 && values[0].getString().equals("jContent");
    }
}
