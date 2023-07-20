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
        Set<String> result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, null, false, true, null);
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
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, null, false, true, null);
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
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, null, false, true, null);
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
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, null, false, true, Arrays.asList("jmix:droppableContent"));
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
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, null, true, true, null);
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
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, null, true, true, null);
        validateResult(testdedNodeName, result, expectedResults);
        expectedResults.clear();

        // test no childnode
        testedType = "jnt:AllowedNodeTypesNone";
        testdedNodeName = testedType;
        testedNode = session.getNode(testSite.getJCRLocalPath()).addNode(testdedNodeName, testedType);
        session.save();
        result = ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, null, false, true, null);
        validateResult(testdedNodeName, result, expectedResults);
        expectedResults.clear();

        // test named child types restrictions
        testedType = "jnt:AllowedNamedNodeTypes";
        testdedNodeName = testedType;
        testedNode = session.getNode(testSite.getJCRLocalPath()).addNode(testdedNodeName, testedType);
        session.save();
        validateResult(testdedNodeName,
            ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, "namedChild", true, true, null),
            Collections.singleton("jnt:AllowedNodeTypesChild"));
        validateResult(testdedNodeName,
            ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, "namedChildEditorial", true, true, null),
            Collections.singleton("jnt:AllowedNodeTypesChildEditorial"));
        validateResult(testdedNodeName,
            ContentEditorUtils.getAllowedNodeTypesAsChildNode(testedNode, null, true, true, null),
            Collections.singleton("jnt:AllowedNodeTypesChildEditorial"));
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
