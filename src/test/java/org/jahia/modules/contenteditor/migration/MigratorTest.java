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
