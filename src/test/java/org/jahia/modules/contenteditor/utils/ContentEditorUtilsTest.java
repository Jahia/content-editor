/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2019 Jahia Solutions Group SA. All rights reserved.
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
package org.jahia.modules.contenteditor.utils;

import org.jahia.api.Constants;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.DummyBundle;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.render.RenderService;
import org.jahia.services.sites.JahiaSite;
import org.jahia.services.templates.ModuleVersion;
import org.jahia.test.framework.AbstractJUnitTest;
import org.jahia.test.utils.TestHelper;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;

import java.util.*;

public class ContentEditorUtilsTest extends AbstractJUnitTest {

    private static final transient Logger logger = org.slf4j.LoggerFactory.getLogger(ContentEditorUtilsTest.class);

    private JCRSessionWrapper session;
    private JahiaTemplatesPackage currentModule, defaultModule;
    private JahiaSite testSite;

    @Before
    public void beforeEach() throws Exception {
        currentModule = new JahiaTemplatesPackage(new DummyBundle());
        currentModule.setName("currentmodule");
        currentModule.setId("currentmodule");
        currentModule.setVersion(new ModuleVersion("1.0.0"));
        currentModule.setModuleType("module");
        currentModule.setActiveVersion(true);

        defaultModule = new JahiaTemplatesPackage(new DummyBundle());
        defaultModule.setName("default");
        defaultModule.setId("default");
        defaultModule.setVersion(new ModuleVersion("1.0.0"));
        defaultModule.setModuleType("module");
        defaultModule.setActiveVersion(true);

        // init sessions
        session = JCRSessionFactory.getInstance().getCurrentSystemSession(Constants.EDIT_WORKSPACE, Locale.ENGLISH, Locale.ENGLISH);

        // init render service
        RenderService.getInstance().setScriptResolvers(Collections.emptyList());

        // Add custom permission
        if (!session.nodeExists("/permissions/jcr:modifyProperties_default_en")) {
            session.getNode("/permissions").addNode("jcr:modifyProperties_default_en", "jnt:permission");
            session.save();
        }

        // set default template package
        // Todo: Use mockito to mock ChoiceListInitializer instead of dummy Render Service / Bundle .
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().register(defaultModule);
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().register(currentModule);

        // init site
        testSite = TestHelper.createSite("GqlEditorFormsUtilsTestSite");
    }

    @After
    public void afterEach() throws Exception {
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().unregister(defaultModule);
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().unregister(currentModule);
        TestHelper.deleteSite(testSite.getSiteKey());
        JCRSessionFactory.getInstance().closeAllSessions();
    }

    @Test
    public void getAllowedNodeTypesAsChildNodeTest() throws Exception {
        Set<String> expectedResults = new HashSet<>();
        String testedType = "jnt:AllowedNodeTypes";
        String testdedNodeName = testedType;
        // test node
        JCRNodeWrapper testedNode = session.getNode(testSite.getJCRLocalPath()).addNode(testdedNodeName, testedType);
        session.save();
        expectedResults.add("jmix:AllowedNodeTypesParentChild");
        expectedResults.add("jnt:AllowedNodeTypesChild");
        expectedResults.add("jnt:AllowedNodeTypesChildEditorial");
        expectedResults.add("jnt:AllowedNodeTypesChildContribute");
        Set<String> result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, false, null);
        validateResult(testedType, result, expectedResults);
        expectedResults.clear();

        // test node with mixin on definition
        testedType = "jnt:AllowedNodeTypesWithMixin";
        testdedNodeName = testedType;
        testedNode = session.getNode(testSite.getJCRLocalPath()).addNode(testdedNodeName, testedType);
        session.save();
        expectedResults.add("jnt:AllowedNodeTypesChild");
        expectedResults.add("jnt:AllowedNodeTypesChildEditorial");
        expectedResults.add("jnt:AllowedNodeTypesChildContribute");
        expectedResults.add("jnt:AllowedNodeTypesChildMixinOnDef");
        expectedResults.add("jnt:AllowedNodeTypesChildEditorialMixinOnDef");
        expectedResults.add("jnt:AllowedNodeTypesChildContributeMixinOnDef");
        expectedResults.add("jnt:AllowedNodeTypesWithMixin");
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, false, null);
        validateResult(testedType, result, expectedResults);
        expectedResults.clear();

        // test node with mixin on node
        testedType = "jnt:AllowedNodeTypes";
        testdedNodeName = testedType + "withMixinOnNode";
        testedNode = session.getNode(testSite.getJCRLocalPath()).addNode(testdedNodeName, testedType);
        testedNode.addMixin("jmix:AllowedNodeTypesMixinOnNode");
        session.save();
        expectedResults.add("jmix:AllowedNodeTypesParentChild");
        expectedResults.add("jnt:AllowedNodeTypesChild");
        expectedResults.add("jnt:AllowedNodeTypesChildEditorial");
        expectedResults.add("jnt:AllowedNodeTypesChildContribute");
        expectedResults.add("jnt:AllowedNodeTypesChildMixinOnNode");
        expectedResults.add("jnt:AllowedNodeTypesChildEditorialMixinOnNode");
        expectedResults.add("jnt:AllowedNodeTypesChildContributeMixinOnNode");
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, false, null);
        validateResult(testdedNodeName, result, expectedResults);
        expectedResults.clear();

        // test filtered node (node with mixin on node)
        testedType = "jnt:AllowedNodeTypes";
        testdedNodeName = testedType + "withFilter";
        testedNode = session.getNode(testSite.getJCRLocalPath()).addNode(testdedNodeName, testedType);
        testedNode.addMixin("jmix:AllowedNodeTypesMixinOnNode");
        session.save();
        expectedResults.add("jnt:AllowedNodeTypesChildEditorial");
        expectedResults.add("jnt:AllowedNodeTypesChildEditorialMixinOnNode");
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, false, Arrays.asList("jmix:editorialContent"));
        validateResult(testdedNodeName, result, expectedResults);
        expectedResults.clear();

        // test contribute node (node with mixin on def + on node)
        testedType = "jnt:AllowedNodeTypesWithMixin";
        testdedNodeName = testedType + "withContribution";
        testedNode = session.getNode(testSite.getJCRLocalPath()).addNode(testdedNodeName, testedType);
        testedNode.addMixin("jmix:AllowedNodeTypesMixinOnNode");
        testedNode.addMixin("jmix:contributeMode");
        testedNode.setProperty("j:contributeTypes", new String[]{"jnt:AllowedNodeTypesChildContribute", "jnt:AllowedNodeTypesChildContributeMixinOnNode", "jnt:AllowedNodeTypesChildContributeMixinOnDef", "jnt:AllowedNodeTypesWithMixin"});
        session.save();
        expectedResults.add("jnt:AllowedNodeTypesChildContribute");
        expectedResults.add("jnt:AllowedNodeTypesChildContributeMixinOnDef");
        expectedResults.add("jnt:AllowedNodeTypesChildContributeMixinOnNode");
        expectedResults.add("jnt:AllowedNodeTypesWithMixin");
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, true, null);
        validateResult(testdedNodeName, result, expectedResults);
        expectedResults.clear();

        // test inherited contribute types restrictions
        testedType = "jnt:AllowedNodeTypesWithMixin";
        testdedNodeName = testedType + "withContributionInherited";
        testedNode = testedNode.addNode(testdedNodeName, testedType);
        session.save();
        expectedResults.add("jnt:AllowedNodeTypesChildContribute");
        expectedResults.add("jnt:AllowedNodeTypesChildContributeMixinOnDef");
        expectedResults.add("jnt:AllowedNodeTypesWithMixin");
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, true, null);
        validateResult(testdedNodeName, result, expectedResults);
        expectedResults.clear();

        // test no childnode
        testedType = "jnt:AllowedNodeTypesNone";
        testdedNodeName = testedType;
        testedNode = session.getNode(testSite.getJCRLocalPath()).addNode(testdedNodeName, testedType);
        session.save();
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, false, null);
        validateResult(testdedNodeName, result, expectedResults);
        expectedResults.clear();
    }

    private void validateResult(String defName, Set<String> results, Set<String> expectedResults) {
        if (results.size() != expectedResults.size()) {
            Assert.fail(String.format("on test def %s expected %s results but got %s", defName, expectedResults.size(), results.size()));
        }
        expectedResults.forEach(expectedValue -> {
            if (!results.contains(expectedValue)) {
                Assert.fail(String.format("on test %s, unable to find %s in results", defName, expectedValue));
            }
        });
    }
}
