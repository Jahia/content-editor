package org.jahia.modules.contenteditor.utils;

import org.apache.commons.lang.StringUtils;
import org.jahia.api.Constants;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.DummyBundle;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
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

import javax.jcr.RepositoryException;
import javax.jcr.nodetype.NodeTypeIterator;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

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
        testedNode.setProperty("j:contributeTypes", new String[]{"jnt:AllowedNodeTypesChildContribute", "jnt:AllowedNodeTypesChildContributeMixinOnNode", "jnt:AllowedNodeTypesChildContributeMixinOnDef"});
        session.save();
        expectedResults.add("jnt:AllowedNodeTypesChildContribute");
        expectedResults.add("jnt:AllowedNodeTypesChildContributeMixinOnDef");
        expectedResults.add("jnt:AllowedNodeTypesChildContributeMixinOnNode");
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

    @Test
    public void getNodetypesTest() throws Exception {

        // deploy default module
        session.getNode(testSite.getJCRLocalPath()).setProperty("j:installedModules", new String[]{"currentmodule"});
        session.save();
        // Get all tree
        // set node type
        List<List<String>> filterTypes = Arrays.asList(null, Arrays.asList("jnt:parentType"), Arrays.asList("jnt:singleParentType"));
        // exclude a type
        List<List<String>> excludedNodeTypes = Arrays.asList(null, Arrays.asList("jnt:parentType"), Arrays.asList("jnt:singleParentType"));
        // include sub types
        List<Boolean> includeSubTypes = Arrays.asList(true, false);
        // validate that the nodetype is in the right section
        filterTypes.forEach(filterType -> excludedNodeTypes.forEach(excludedNodeType -> includeSubTypes.forEach(includeSubType -> {
            doTest(filterType, excludedNodeType, includeSubType, testSite.getJCRLocalPath(), session);
        })));
    }

    private void doTest(List<String> nodeType, List<String> excludedNodeType, boolean includeSubTypes, String sitePath, JCRSessionWrapper session) {
        try {
            final Set<NodeTypeTreeEntry> tree = ContentEditorUtils.getContentTypesAsTree(nodeType, excludedNodeType, includeSubTypes, sitePath, session, Locale.ENGLISH);
            // we are testing that all node types registered that is part of the tree is consistent.
            for (NodeTypeIterator nti = NodeTypeRegistry.getInstance().getNodeTypes("currentmodule"); nti.hasNext(); ) {
                ExtendedNodeType extendedNodeType = (ExtendedNodeType) nti.nextNodeType();

                NodeTypeTreeEntry entry = getEntry(tree, extendedNodeType.getName());
                if (entry == null) {
                    // improve the test to validate that we should have found the entry ..
                    // check known issues
                    List<String> knownExistingTypes = Arrays.asList("jnt:cat1Subtype1", "jnt:cat2Subtype1", "jnt:cat1ype1", "jnt:cat2ype1");
                    boolean customType = nodeType != null && StringUtils.equals(extendedNodeType.getName(), nodeType.get(0)) && excludedNodeType == null;
                    boolean knownTypes = nodeType == null && knownExistingTypes.contains(extendedNodeType.getName()) && includeSubTypes && excludedNodeType == null;
                    if (customType || knownTypes) {
                        Assert.fail(extendedNodeType.getName() + "should have an entry but have not");
                    }
                    continue;
                }
                // test disambiguateLabels
                if (extendedNodeType.isNodeType("jnt:cat2ype1") || extendedNodeType.isNodeType("test:cat2ype1")) {
                    if (!StringUtils.equals(entry.getLabel(), extendedNodeType.getLabel(Locale.ENGLISH) + " (" + extendedNodeType.getName() + ")")) {
                        Assert.fail(String.format("Entry expected was [%s], but found [%s]", entry.getLabel(), extendedNodeType.getLabel(Locale.ENGLISH) + " (" + extendedNodeType.getName() + ")"));
                    }
                }

                // validate one tree entry
                if (entry.getNodeType().isNodeType("jnt:singleParentType") || !includeSubTypes) {
                    if (tree.size() != 1 && entry.getChildren() != null) {
                        Assert.fail("we should have only one entry with no children for jnt:singleParentType");
                    }
                    if (!StringUtils.equals(entry.getName(), extendedNodeType.getName())) {
                        Assert.fail(entry.getName() + " names is not the name expected " + extendedNodeType.getName());
                    }
                    continue;
                }
                // test node types entries
                if (entry.getChildren() == null) {
                    // check that non droppable content is not part of the tree (or in the nt:base entry)
                    if (!extendedNodeType.isNodeType("jmix:droppableContent") && !matchParentEntry(tree, entry.getName(), "nt:base")) {
                        Assert.fail(entry.getName() + " should not be find as a tree entry");
                    }
                    // check type filtering
                    if (nodeType != null && !entry.getNodeType().isNodeType(nodeType.get(0))) {
                        Assert.fail(entry.getName() + "should be a sub type of " + nodeType.get(0));
                    }
                    // check type exclusion
                    if (excludedNodeType != null && entry.getNodeType().isNodeType(excludedNodeType.get(0))) {
                        Assert.fail(entry.getName() + "should not be a sub type of " + excludedNodeType.get(0));
                    }
                    // valid entry
                    boolean parentFound = false;
                    for (NodeTypeIterator nt = NodeTypeRegistry.getInstance().getNodeType("jmix:droppableContent").getDeclaredSubtypes(); nt.hasNext(); ) {
                        ExtendedNodeType parentNodeType = (ExtendedNodeType) nt.nextNodeType();
                        // validate that entry has the proper parent
                        if (extendedNodeType.isNodeType(parentNodeType.getName())) {
                            Assert.assertTrue(entry.getName() + "is not a child of " + parentNodeType.getName(), matchParentEntry(tree, entry.getName(), parentNodeType.getName()));
                            parentFound = true;
                        }
                    }
                    parentFound = parentFound || matchParentEntry(tree, entry.getName(), "nt:base");
                    if (!parentFound) {
                        Assert.fail("unable to resolve parent tree entry for type " + entry.getName());
                    }
                } else {
                    // check root entries
                    if (!StringUtils.equals(entry.getName(), "nt:base") && !entry.getNodeType().isMixin()) {
                        Assert.fail("root entry should be either a mixin or nt:base but found " + entry.getName());
                    }
                }

            }
        } catch (RepositoryException e) {
            Assert.fail(e.getMessage());
        }
    }

    private NodeTypeTreeEntry getEntry(Collection<NodeTypeTreeEntry> tree, String name) {
        AtomicReference<NodeTypeTreeEntry> result = null;
        for (NodeTypeTreeEntry treeEntry : tree) {
            if (StringUtils.equals(treeEntry.getName(), name)) {
                return treeEntry;
            }
            if (treeEntry.getChildren() != null && getEntry(treeEntry.getChildren(), name) != null) {
                return getEntry(treeEntry.getChildren(), name);
            }
        }
        return null;
    }

    private boolean matchParentEntry(Collection<NodeTypeTreeEntry> tree, String name, String parentName) {
        return tree.stream().anyMatch(entry -> StringUtils.equals(entry.getName(), parentName) && getEntry(entry.getChildren(), name) != null);
    }
}
