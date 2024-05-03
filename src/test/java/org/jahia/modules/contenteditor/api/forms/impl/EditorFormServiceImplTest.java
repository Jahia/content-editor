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
package org.jahia.modules.contenteditor.api.forms.impl;

import org.eclipse.core.runtime.Assert;
import org.jahia.api.Constants;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.DummyBundle;
import org.jahia.modules.contenteditor.api.forms.*;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializerService;
import org.jahia.services.render.RenderService;
import org.jahia.services.sites.JahiaSite;
import org.jahia.services.templates.ModuleVersion;
import org.jahia.test.framework.AbstractJUnitTest;
import org.jahia.test.utils.TestHelper;
import org.json.simple.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

public class EditorFormServiceImplTest extends AbstractJUnitTest {

    private static final Logger log = LoggerFactory.getLogger(EditorFormServiceImplTest.class);
    private EditorFormService editorFormService;
    private StaticDefinitionsRegistry staticDefinitionsRegistry;

    private JahiaSite testSite;
    private JCRNodeWrapper textNode;
    private JCRNodeWrapper folderNode;
    private JCRNodeWrapper contentListNode;
    private JCRNodeWrapper unstructuredNews;
    private JCRNodeWrapper defaultOverrideContent;
    private JahiaTemplatesPackage defaultModule, templatesWeb;
    private static JCRSessionWrapper session;

    @Before
    public void beforeEach() throws Exception {

        staticDefinitionsRegistry = new StaticDefinitionsRegistry();
        // init service
        editorFormService = new EditorFormServiceImpl();
        ((EditorFormServiceImpl) editorFormService).setChoiceListInitializerService(ChoiceListInitializerService.getInstance());
        ((EditorFormServiceImpl) editorFormService).setNodeTypeRegistry(NodeTypeRegistry.getInstance());
        ((EditorFormServiceImpl) editorFormService).setStaticDefinitionsRegistry(staticDefinitionsRegistry);
        ((EditorFormServiceImpl) editorFormService).setJahiaTemplateManagerService(ServicesRegistry.getInstance().getJahiaTemplateManagerService());


        // init sessions
        session = JCRSessionFactory.getInstance().getCurrentSystemSession(Constants.EDIT_WORKSPACE, Locale.ENGLISH, Locale.ENGLISH);

        // init render service
        RenderService.getInstance().setScriptResolvers(Collections.emptyList());

        // set default template package
        // Todo: Use mockito to mock ChoiceListInitializer instead of dummy Render Service / Bundle ..
        defaultModule = new JahiaTemplatesPackage(new DummyBundle());
        defaultModule.setName("default");
        defaultModule.setId("default");
        defaultModule.setVersion(new ModuleVersion("1.0.0"));
        defaultModule.setActiveVersion(true);
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().register(defaultModule);
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().addPackageForResourceBundle("JahiaTypesResources", defaultModule);

        templatesWeb = new JahiaTemplatesPackage(new DummyBundle());
        templatesWeb.setName("templates-web");
        templatesWeb.setId("templates-web");
        templatesWeb.setVersion(new ModuleVersion("1.0.0"));
        templatesWeb.setActiveVersion(true);
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().register(templatesWeb);

        // init site
        testSite = TestHelper.createSite("editorFormServiceSite");

        // init static definition registry
        staticDefinitionsRegistry.readEditorFormDefinition(EditorFormServiceImpl.class.getClassLoader().getResource("META-INF/jahia-content-editor-forms/forms/nt_base.json"), new DummyBundle(0));

        // create text content
        textNode = session.getNode(testSite.getJCRLocalPath()).addNode("test", "jnt:text");

        // create folder

        folderNode = session.getNode(testSite.getJCRLocalPath()).addNode("testFolder", "jnt:folder");
        // create content list
        contentListNode = session.getNode(testSite.getJCRLocalPath()).addNode("testList", "jnt:contentList");
        session.save();

        // Add permission
        if (!session.itemExists("/permissions/jcr:modifyProperties_default_en")) {
            session.getNode("/permissions").addNode("jcr:modifyProperties_default_en", "jnt:permission");
            session.save();
        }

        // create unstructured content
        unstructuredNews = session.getNode(testSite.getJCRLocalPath()).addNode("unstructuredNews", "jnt:unstructuredNews");
        session.save();

        //create default override content
        defaultOverrideContent = session.getNode(testSite.getJCRLocalPath()).addNode("defaultOverrideContent", "jnt:defaultOverrideContent");
        session.save();
    }

    @After
    public void afterEach() throws Exception {
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().unregister(defaultModule);
        TestHelper.deleteSite(testSite.getSiteKey());
        JCRSessionFactory.getInstance().closeAllSessions();
    }

    /**
     * Given the content type inherits mixins defined in the cnd
     * When the API for a content type is called
     * Then the API returns a list of json forms
     */
    @Test
    public void simpleDefinition() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("testNode", "jnt:simple");
        simpleContent.setProperty("prop", "propValue");
        session.save();
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        EditorForm createForm = editorFormService.getCreateForm("jnt:simple", Locale.ENGLISH, Locale.ENGLISH, testSite.getJCRLocalPath());
        String sectionName = "content";
        Map<String, List<String>> expectedFieldsSet = new HashMap<>();
        expectedFieldsSet.put("jnt:simple", Collections.singletonList("prop"));

        checkResults(form, sectionName, expectedFieldsSet);
        checkResults(createForm, sectionName, expectedFieldsSet);

    }

    /**
     * Given the content type extends mixins defined in the cnd
     * When the API for a content type is called
     * Then the API returns the extend mixins as a list forms defining a fieldset and including fields
     */
    @Test
    public void simpleWithMixinDefinition() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("testNode", "jnt:simpleWithMix");
        simpleContent.setProperty("prop", "propValue");
        session.save();
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        EditorForm createForm = editorFormService.getCreateForm("jnt:simpleWithMix", Locale.ENGLISH, Locale.ENGLISH, testSite.getJCRLocalPath());
        String sectionName = "content";
        Map<String, List<String>> expectedFieldsSet = new HashMap<>();
        expectedFieldsSet.put("jnt:simpleWithMix", Collections.singletonList("prop"));
        expectedFieldsSet.put("jmix:mix1", Collections.singletonList("propMix1"));
        expectedFieldsSet.put("jmix:mix2", Collections.singletonList("propMix2"));

        checkResults(form, sectionName, expectedFieldsSet);
        checkResults(createForm, sectionName, expectedFieldsSet);
    }

    /**
     * Given the content type amd a mixin defined in the cnd
     * When the API for a content type is called for a node from that type that has that mixin
     * Then the API returns the extend mixins as a list forms defining a fieldset and including fields
     */
    @Test
    public void simpleWithMixinContent() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("testNode", "jnt:simple");
        simpleContent.addMixin("jmix:mix1");
        simpleContent.setProperty("prop", "propValue");
        session.save();
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        String sectionName = "content";
        Map<String, List<String>> expectedFieldsSet = new HashMap<>();
        expectedFieldsSet.put("jnt:simple", Collections.singletonList("prop"));
        expectedFieldsSet.put("jmix:mix1", Collections.singletonList("propMix1"));

        checkResults(form, sectionName, expectedFieldsSet);
    }

    @Test
    public void simpleWithExtendsWithMixinContent() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("testNode", "jnt:simpleWithExtends");
        simpleContent.addMixin("jmix:mix1");
        simpleContent.setProperty("prop", "propValue");
        session.save();
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        EditorForm createForm = editorFormService.getCreateForm("jnt:simpleWithExtends", Locale.ENGLISH, Locale.ENGLISH, testSite.getJCRLocalPath());
        String sectionName = "content";

        Map<String, List<String>> expectedFieldsSet = new HashMap<>();
        expectedFieldsSet.put("jnt:simpleWithExtends", Collections.singletonList("prop:false:true"));
        expectedFieldsSet.put("jmix:extendsSimpleMixin", Collections.singletonList("extension:true:false"));
        // Create
        checkResults(createForm, sectionName, expectedFieldsSet);
        // Edit
        expectedFieldsSet.put("jmix:mix1", Collections.singletonList("propMix1:false:true"));
        checkResults(form, sectionName, expectedFieldsSet);


        simpleContent.addMixin("jmix:extendsSimpleMixin");
        simpleContent.setProperty("extension", "extension Value");
        session.save();

        EditorForm newForm = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        expectedFieldsSet = new HashMap<>();
        expectedFieldsSet.put("jnt:simpleWithExtends", Collections.singletonList("prop:false:true"));
        expectedFieldsSet.put("jmix:mix1", Collections.singletonList("propMix1:false:true"));
        expectedFieldsSet.put("jmix:extendsSimpleMixin", Collections.singletonList("extension:true:true"));
        checkResults(newForm, sectionName, expectedFieldsSet);
    }

    @Test
    public void simpleWithRank() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("testNode", "jnt:simpleRank");
        session.save();
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        String sectionName = "content";
        // validate that the 'prop3' rank is the last one
        EditorFormFieldSet fieldSet = getFieldSet(form, sectionName, "jnt:simpleRank");
        ArrayList<EditorFormField> fields = new ArrayList<>(fieldSet.getEditorFormFields());
        Assert.isTrue(fields.get(2).getName().equals("prop3"), "according to the definition, prop3 is not the last proprety but should be");
        // Apply the override
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jnt_simple_rank_field.json");
        EditorForm newForm = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        // validate that the 'prop3' rank is the first one
        fieldSet = getFieldSet(newForm, sectionName, "jnt:simpleRank");
        fields = new ArrayList<>(fieldSet.getEditorFormFields());
        Assert.isTrue(getField(newForm, sectionName, "jnt:simpleRank", "prop3").getTarget().getRank() == 0, "Overrided rank in target should be 0");

        // validate that the 'prop3' is the first in the set
        Assert.isTrue(fields.get(0).getName().equals("prop1"), "according to the definition, prop1 is not the 1st property but should be");
        Assert.isTrue(fields.get(1).getName().equals("prop3"), "according to the definition, prop3 is not the 2nd property but should be");
        Assert.isTrue(fields.get(2).getName().equals("prop2"), "according to the definition, prop2 is not the last property but should be");
    }

    @Test
    public void simpleWithMixinPropertiesOverride() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("testNode", "jnt:simpleWithMixProperties");
        simpleContent.setProperty("propMix1", "propMixinValue");

        session.save();
        // edit
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        simpleWithMixinPropertiesOverrideResults(form);
        // create
        EditorForm createForm = editorFormService.getCreateForm("jnt:simpleWithMixProperties", Locale.ENGLISH, Locale.ENGLISH, testSite.getJCRLocalPath());
        simpleWithMixinPropertiesOverrideResults(createForm);
    }

    @Test
    public void testHasPreviewOverride() throws Exception {
        // ** Test on folder.
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, folderNode.getPath());
        int numSections = form.getSections().size();

        // Add base + override of folder
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.override.json"),
            new DummyBundle(0));
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/jnt_folder.json"), new DummyBundle(0));

        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, folderNode.getPath());
        Assert.isTrue(!form.hasPreview(), "Override of folder should NOT have preview");
        Assert.isTrue(form.getSections() != null && form.getSections().size() == numSections, "Override should NOT have change sections");

        // ** Test on text
        // Check default behaviour of text
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.hasPreview(), "text should have preview without overrides");

        // Add override of a supertype that hides the preview.
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/jnt_content.json"), new DummyBundle(0));
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(!form.hasPreview(), "Override of content should make text should NOT have preview");

        // Add override of text that does nothing.
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/jnt_text.json"), new DummyBundle(0));
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(!form.hasPreview(), "Override of text should make text NOT have preview");

        // Add a mixin on the node.
        textNode.addMixin("jmix:hasPreview");
        session.save();
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(!form.hasPreview(), "Add mixin and override of text should make text NOT have preview");

        // Add override of the mixin that displays the preview
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/jmix_hasPreview.json"), new DummyBundle(0));
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.hasPreview(), "Add mixin and override of mixin should make text have preview");

        textNode.removeMixin("jmix:hasPreview");
        session.save();
    }

    @Test
    public void testSectionOverride() throws Exception {
        // inject custom section
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.override.json"), new DummyBundle(0));

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.getSections().size() == 5, "Override contains more than one section");
        EditorFormSection section = form.getSections().stream().filter(s -> s.getName().equals("layout")).findFirst().orElse(null);
        Assert.isNotNull(section, "Override does not contains \"layout\" section");
    }


    @Test
    public void testSectionHidden() throws Exception {
        // inject custom section
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.override"
            + ".displayModes.json"), new DummyBundle(0));

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.getSections().size() == 5, "Override contains more than one section");
        EditorFormSection section = form.getSections().stream().filter(s -> s.getName().equals("layout")).findFirst().orElse(null);

        Assert.isNotNull(section, "Override does not contains \"layout\" section");

        Assert.isTrue(!section.isHide(), "Override should set the hide value of the \"layout\" section to false");

        EditorForm createForm = editorFormService.getCreateForm("jnt:text", Locale.ENGLISH, Locale.ENGLISH, testSite.getJCRLocalPath());

        Assert.isTrue(createForm.getSections().size() == 5, "Override contains more than one section");
        EditorFormSection sectionInCreateMode =
            createForm.getSections().stream().filter(s -> s.getName().equals("layout")).findFirst().orElse(null);

        Assert.isNotNull(sectionInCreateMode, "Override does not contains \"layout\" section");

        Assert.isTrue(sectionInCreateMode.isHide(), "Override should set the hide value of the \"layout\" section to true");
    }

    @Test
    public void testSectionPriorityOverride() throws Exception {
        // inject custom sections on base with higher priority.
        // check the override
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.override.json"),
            new DummyBundle(0));
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        int initNumSections = 5;
        Assert.isTrue(form.getSections().size() == initNumSections, "Priority check on section does not contain 1 section");
        EditorFormSection section = form.getSections().stream().filter(s -> s.getName().equals("layout")).findFirst().orElse(null);
        Assert.isNotNull(section, "Priority check on section does not contain options then content");

        // inject same priority / nodeType => should not change anything
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.same-priority.json"), new DummyBundle(0));
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.getSections().size() == initNumSections,
            "Same priority should not taken in account : Priority check on section does not contain 1 section");
        section = form.getSections().stream().filter(s -> s.getName().equals("layout")).findFirst().orElse(null);
        Assert.isNotNull(section, "Same priority should not taken in account : Priority check on section does not contain options then content");

        // Inject higher priority
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.priority.json"), new DummyBundle(0));
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.getSections().size() == initNumSections, "Priority check on section does not contain 2 sections");

        boolean hasOptions = false;
        boolean hasContent = false;
        for (EditorFormSection s :form.getSections()) {
            if (s.getName().equals("options")) {
                hasOptions = true;
            } else if (s.getName().equals("content")) {
                hasContent = true;
                Assert.isTrue(hasOptions, "Priority check on section does not contain options then content");
            }
        }
        Assert.isTrue(hasOptions && hasContent);
    }

    @Test
    public void testSectionForNodeTypeOverride() throws Exception {
        // inject text override
        staticDefinitionsRegistry.readEditorFormDefinition(
            getResource("META-INF/jahia-content-editor-forms/forms/jnt_text.json"), new DummyBundle(0));

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.getSections().size() == 5, "Override contains more than one section");
        EditorFormSection section = form.getSections().stream().filter(s -> s.getName().equals("metadata")).findFirst().orElse(null);
        Assert.isNotNull(section, "Override does not contains \"metadata\" section");
    }

    @Test
    public void testRemoveFieldSetOverride() throws Exception {

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        // description is present
        Assert.isTrue(hasFieldSet(form, "metadata", "jmix:description"), "description not found");
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jmix_description_remove_fieldset.json");

        // description is removed
        EditorForm newForm = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(!hasFieldSet(newForm, "metadata", "jmix:description"), "description is found but should not");
    }

    /**
     * Given I define a JSON override next to my mixin cnd definition that set a target for a fieldset: "target":{"itemType":"layout"}
     * <p>
     * When the API for a content type is called
     * <p>
     * Then the API will take the override into account and return the JSON with the fieldset in the right itemType
     * <p>
     * Fields can also support target : "target":{"itemType":"layout", "fieldset":"view" }
     *
     * @throws Exception
     */
    @Test
    public void testMoveFieldSetOverride() throws Exception {
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        // test that tagged is in jmix:tagged
        Assert.isTrue(hasField(form, "metadata", "jmix:tagged", "j:tagList"), "cannot find jmix:tagged in metadata section");
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jmix_tagged_move_field.json");
        EditorForm newForm = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        // field has been moved
        Assert.isTrue(hasField(newForm, "classification", "jmix:categorized", "j:tagList"), "cannot find j:tagList in jmix:categorized fieldsetName in classification section");
        Assert.isTrue(!hasFieldSet(newForm, "metadata", "jmix:tagged"), "can find jmix:tagged in metadata section");
    }

    /**
     * Given I define a JSON override a field to add a value constraints
     * <p>
     * When the API for a content type is called
     * <p>
     * Then the API will take the override into account and return the JSON with the fieldset in the right itemType
     * <p>
     * Fields can also support value constraint : "valueConstraints": [
     *         {
     *           "value": {
     *             "type": "String",
     *             "value": "myConstraint"
     *           },
     *           "displayValue": "myConstraint"
     *         }
     *       ]
     *
     * @throws Exception
     */
    @Test
    public void testAddFieldWithValueConstraintOverride() throws Exception {
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jmix_description_value_constraint.json");
        // test that description is in jmix:description
        Assert.isTrue(hasField(form, "metadata", "jmix:description", "jcr:description"), "cannot find jcr:description field "
            + "jmix:description fieldset in metadata section");

        EditorForm newForm = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        // Field contains a value constraint
        List<EditorFormFieldValueConstraint> valueConstraints = getValueConstraints(newForm, "metadata", "jmix:description", "jcr:description");

        Assert.isTrue(valueConstraints
                .stream()
                .anyMatch(valueConstraint -> valueConstraint.getDisplayValue().equals("myConstraint"))
            , "The value" + valueConstraints.get(0).getDisplayValue());
    }

    @Test
    public void testUnstructuredFieldSetOverride() throws Exception {
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jnt_unstructuredNews.json");
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, unstructuredNews.getPath());
        Assert.isTrue(hasField(form, "content", "jnt:unstructuredNews", "text"), "cannot find jmix:tagged in metadata section");
        Assert.isTrue(hasField(form, "content", "jnt:unstructuredNews", "description"), "cannot find jmix:tagged in metadata section");
    }

    @Test
    public void testOverridesFromDifferentBundles() throws Exception {
        staticDefinitionsRegistry
            .readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.override.json"), new DummyBundle(0));

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        int numSections = form.getSections().size();
        EditorFormSection section = form.getSections().stream().filter(s -> s.getName().equals("layout")).findFirst().orElse(null);
        Assert.isNotNull(section, "Check on section does not contain layout section");
        Assert.isTrue(!section.isHide(), "Section should not be hidden");

        SortedSet<EditorFormDefinition> formDefinitions = staticDefinitionsRegistry.getFormDefinitions("nt:base");
        int numDefinitions = 2; // we have nt:base definitions from /api and /test
        Assert.isTrue(formDefinitions.size() == numDefinitions, "Number of form definition is not correct");

        // inject same file from another bundle => should be added
        staticDefinitionsRegistry
            .readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.override.json"), new DummyBundle(1));
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(formDefinitions.size() == numDefinitions + 1, "Number of form definition is not correct");
        Assert.isTrue(form.getSections().size() == numSections, "Should have same number of sections");

        // inject another file from another bundle => should be added
        staticDefinitionsRegistry
            .readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/forms/nt_base.hidden-layout.json"),
                new DummyBundle(1));
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(formDefinitions.size() == numDefinitions + 2, "Number of form definition is not correct");
        Assert.isTrue(form.getSections().size() == numSections, "Should have same number of sections");
        section = form.getSections().stream().filter(s -> s.getName().equals("layout")).findFirst().orElse(null);
        Assert.isTrue(section.isHide(), "Section should be hidden");

        formDefinitions = staticDefinitionsRegistry.getFormDefinitions("nt:base");
        Assert.isTrue(formDefinitions.size() == numDefinitions + 2, "Number of form definition is not correct");
    }

    @Test
    public void testOverrides() throws Exception {
        //First, check if the concerned fields are present
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, defaultOverrideContent.getPath());
        Assert.isTrue(hasField(form, "options", "jmix:cache", "j:expiration"), "could find jmix:cache in options section");
        Assert.isTrue(hasField(form, "options", "jmix:cache", "j:perUser"), "could find jmix:cache in options section");
        Assert.isTrue(hasField(form, "classification", "jmix:categorized", "j:defaultCategory"), "could find jmix:categorized in classification section");
        Assert.isTrue(hasField(form, "metadata", "jmix:keywords", "j:keywords"), "could find jmix:tags in options section");
        Assert.isTrue(!form.getSections().get(0).getFieldSets().get(0).getName().equals("mix:title"), "mix title should not be the first fieldset");

        //Reading the overrides json files
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jmix_cache.json");
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jmix_categorized.json");
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jmix_keywords.json");
        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/mix_title.json");
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, defaultOverrideContent.getPath());

        //Checking if the fields disappeared
        Assert.isTrue(!hasField(form, "options", "jmix:cache", "j:expiration"), "could find jmix:cache in options section");
        Assert.isTrue(!hasField(form, "options", "jmix:cache", "j:perUser"), "could find jmix:cache in options section");
        Assert.isTrue(!hasField(form, "classification", "jmix:categorized", "j:defaultCategory"), "could find jmix:categorized in classification section");
        Assert.isTrue(!hasField(form, "metadata", "jmix:keywords", "j:keywords"), "could find jmix:tags in options section");
        Assert.isTrue(form.getSections().get(0).getFieldSets().get(0).getName().equals("mix:title"), "mix title should be the first fieldset");
    }

    @Test
    public void hiddenFieldSet() throws Exception {
        checkHiddenFieldSet("jmix:hiddenFieldSet", "jmix:hiddenFieldSetExtends");
    }

    @Test
    public void hiddenFieldSetUsingNewNameForTemplateMixin() throws Exception {
        checkHiddenFieldSet("jmix:hiddenFieldSetV2", "jmix:hiddenFieldSetExtendsV2");
    }

    @Test
    public void testFieldWithValueConstraintOverride() throws Exception {
        List<EditorFormFieldValueConstraint> fieldValueConstraints = editorFormService.getFieldConstraints(textNode.getPath(), textNode.getParent().getPath(), "jnt:text", "jnt:simpleRank", "prop3", new ArrayList<>(), Locale.ENGLISH, Locale.ENGLISH);

        Assert.isTrue(fieldValueConstraints.isEmpty(), "The field value constraints must be empty");

        readEditorFormFieldSet("META-INF/jahia-content-editor-forms/fieldsets/jnt_simple_rank_override_field_value_constraints.json");
        fieldValueConstraints = editorFormService.getFieldConstraints(textNode.getPath(), textNode.getParent().getPath(), "jnt:text", "jnt:simpleRank", "prop3", new ArrayList<>(), Locale.ENGLISH, Locale.ENGLISH);

        Assert.isTrue(fieldValueConstraints.size() == 2, "The field value constraints must contains two values");
        Assert.isTrue(fieldValueConstraints.get(0).getDisplayValue().equals("First constraint"), "according to the definition override in jnt_simple_rank_override_field_value_constraints.json");
        Assert.isTrue(fieldValueConstraints.get(1).getDisplayValue().equals("Second constraint"), "according to the definition override in jnt_simple_rank_override_field_value_constraints.json");
    }

    @Test
    public void testValueConstraintRetrieval() throws Exception {
        // When creating a node, we do not have the node, but we have the parent and the node type:
        List<EditorFormFieldValueConstraint> fieldValueConstraints = editorFormService.getFieldConstraints(null, contentListNode.getParent().getPath(),
            "jnt:contentList", "jmix:orderedList", "firstField", new ArrayList<>(), Locale.ENGLISH, Locale.ENGLISH);
        int constraintsSize = fieldValueConstraints.size();

        Assert.isTrue(constraintsSize > 0, "The list of constraint for jmix:orderedList.firstField should not be empty");

        // When editing a node, we have the node, the parent and the node type:
        fieldValueConstraints = editorFormService.getFieldConstraints(contentListNode.getPath(), contentListNode.getParent().getPath(),
            "jnt:contentList", "jmix:orderedList", "firstField", new ArrayList<>(), Locale.ENGLISH, Locale.ENGLISH);

        Assert.isTrue(constraintsSize == fieldValueConstraints.size(), "We should have the same number of constraints, either if the node exists or not");
    }

    /**
     * Extends mixin willl group all the properties from their supertypes under same fieldset
     * @throws Exception
     */
    @Test
    public void testExtendsMixins() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("testNode", "jnt:mapServiceSimple");
        simpleContent.addMixin("jmix:mapLink");
        simpleContent.setProperty("subTitle", "sub title");
        simpleContent.setProperty("secondTitle", "second title");
        simpleContent.setProperty("titleLink", "title");
        session.save();
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());

        Assert.isTrue(hasField(form, "content", "jnt:mapServiceSimple", "thematicColor"), "could not find thematicColor in content "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:mapLink", "subTitle"), "could not find subTitle in jmix:mapLink "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:mapLink", "secondTitle"), "could not find secondTitle in jmix:mapLink "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:mapLink", "titleLink"), "could not find titleLink in jmix:mapLink "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:mapLink", "internalLink"), "could not find internalLink in jmix:mapLink "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:mapLink", "externalLink"), "could not find externalLink in jmix:mapLink "
            + "section");
    }

    /**
     * Mixin added on a specific node should behave as mixin added on node types (all supertypes are in different fieldset)
     * @throws Exception
     */
    @Test
    public void testAddedMixins() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("testNode", "jnt:mapServiceSimple");
        simpleContent.addMixin("jmix:mapLinkNoExtends");
        simpleContent.setProperty("subTitle", "sub title");
        simpleContent.setProperty("secondTitle", "second title");
        simpleContent.setProperty("titleLink", "title");
        session.save();
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());

        Assert.isTrue(hasField(form, "content", "jnt:mapServiceSimple", "thematicColor"), "could not find thematicColor in content "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:mapLink", "subTitle"), "could not find subTitle in jmix:mapLink "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:linkCommonsSecond", "secondTitle"), "could not find secondTitle in jmix:linkCommonsSecond "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:linkCommons", "titleLink"), "could not find titleLink in jmix:linkCommons "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:linkCommons", "internalLink"), "could not find internalLink in jmix:linkCommons "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:linkCommons", "externalLink"), "could not find externalLink in jmix:linkCommons "
            + "section");
    }

    @Test
    public void testPrimaryNodeTypeExtendsTemplateMixin() throws Exception {
        JCRNodeWrapper simpleContent = session.getNode(testSite.getJCRLocalPath()).addNode("externalLinkIssueExample", "jnt:externalLinkIssueExample");
        session.save();
        // edit
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, simpleContent.getPath());
        EditorFormFieldSet fs = getFieldSet(form, "content", "jmix:externalLink");
        Assert.isTrue(fs.getDisplayed(), "FieldSet should be displayed");
        Assert.isTrue(fs.getActivated(), "FieldSet should be activated");
        Assert.isTrue(!fs.getDynamic(), "FieldSet should not be dynamic");
        Assert.isTrue(hasField(form, "content", "jnt:externalLinkIssueExample", "text"), "could not find text in content "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:externalLink", "j:linkTitle"), "could not find text in content "
            + "section");
        Assert.isTrue(hasField(form, "content", "jmix:externalLink", "j:url"), "could not find text in content "
            + "section");
    }

    private URL getResource(String s) {
        return getClass().getClassLoader().getResource(s);
    }

    private EditorFormSection getSection(EditorForm form, final String searchedSection) {
        List<EditorFormSection> sections = form.getSections().stream().filter(section -> section.getName().equals(searchedSection)).collect(Collectors.toList());
        Assert.isTrue(sections.size() < 2, "More than one section match : " + searchedSection);
        if (sections.size() > 0) {
            return sections.get(0);
        } else {
            throw new NoSuchElementException("No section match " + searchedSection);
        }
    }

    private boolean hasSection(EditorForm form, final String searchedSection) {
        try {
            getSection(form, searchedSection);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private EditorFormFieldSet getFieldSet(EditorForm form, final String searchedSection, final String searchedFieldSet) {
        List<EditorFormFieldSet> formFieldSets = getSection(form, searchedSection).getFieldSets().stream().filter(fieldSets -> fieldSets.getName().equals(searchedFieldSet)).collect(Collectors.toList());
        Assert.isTrue(formFieldSets.size() < 2, "More than one fieldSet match section / fieldset : " + searchedSection + " / " + searchedFieldSet);
        if (!formFieldSets.isEmpty()) {
            return formFieldSets.get(0);
        } else {
            throw new NoSuchElementException("No fieldSet match section / fieldset : " + searchedSection + " / " + searchedFieldSet);
        }
    }

    private boolean hasFieldSet(EditorForm form, final String searchedSection, final String searchedFieldSet) {
        try {
            getFieldSet(form, searchedSection, searchedFieldSet);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private EditorFormField getField(EditorForm form, final String searchedSection, final String searchedFieldSet, final String searchedField) {
        EditorFormFieldSet fieldSet = getFieldSet(form, searchedSection, searchedFieldSet);
        List<EditorFormField> fields = fieldSet.getEditorFormFields().stream().filter(field -> field.getName().equals(searchedField)).collect(Collectors.toList());
        Assert.isTrue(fields.size() < 2, "More than one field match section / fieldset / field : " + searchedSection + " / " + searchedFieldSet + " / " + searchedField);
        if (!fields.isEmpty()) {
            return fields.get(0);
        } else {
            log.error("Fields in fieldset : " + fieldSet.getName() + " : " + fieldSet.getEditorFormFields().stream().map(EditorFormField::getName).collect(Collectors.joining(", ")) + " for section " + searchedSection);
            log.error(getSection(form, searchedSection).getFieldSets().stream().map(EditorFormFieldSet::getName).collect(Collectors.joining(", ")));
            throw new NoSuchElementException("No field match section / fieldset / field : " + searchedSection + " / " + searchedFieldSet + " / " + searchedField);
        }
    }

    private boolean hasField(EditorForm form, final String searchedSection, final String searchedFieldSet, final String searchedField) {
        try {
            getField(form, searchedSection, searchedFieldSet, searchedField);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private void checkResults(EditorForm form, String sectionName, Map<String, List<String>> expectedFieldsSet) {
        // one section
        Assert.isTrue(form.getSections().size() == 1, "Override contains more than one section");
        // Section is content
        Assert.isTrue(hasSection(form, sectionName), "unable to find section " + sectionName);
        // 3 fields Set
        Assert.isTrue(form.getSections().get(0).getFieldSets().size() == expectedFieldsSet.size(), "Expected " + expectedFieldsSet.size() + " fields set but get " + form.getSections().get(0).getFieldSets().size());
        for (Map.Entry<String, List<String>> expectedFieldSet : expectedFieldsSet.entrySet()) {
            Assert.isTrue(hasFieldSet(form, sectionName, expectedFieldSet.getKey()), "unable to find expected FieldSet " + expectedFieldSet.getKey() + " for section " + sectionName);
            for (String fieldDesc : expectedFieldSet.getValue()) {
                String[] fieldArray = fieldDesc.split(":");
                String fieldName = "";
                Boolean fieldDynamic;
                Boolean fieldActivated;

                if (fieldArray.length > 0) {
                    fieldName = fieldArray[0];
                    Assert.isTrue(hasField(form, sectionName, expectedFieldSet.getKey(), fieldName), "unable to find expected Field " + fieldName + " for  FieldSet " + expectedFieldSet.getKey() + " and section " + sectionName);
                }
                if (fieldArray.length > 1) {
                    fieldDynamic = Boolean.parseBoolean(fieldArray[1]);
                    Assert.isTrue(getFieldSet(form, sectionName, expectedFieldSet.getKey()).getDynamic() == fieldDynamic, "unable to find expected FieldSet " + expectedFieldSet.getKey() + " to be dynamic " + fieldDynamic);
                }
                if (fieldArray.length > 2) {
                    fieldActivated = Boolean.parseBoolean(fieldArray[2]);
                    Assert.isTrue(getFieldSet(form, sectionName, expectedFieldSet.getKey()).getActivated() == fieldActivated, "unable to find expected FieldSet " + expectedFieldSet.getKey() + " to be activated " + fieldActivated);
                }

            }
        }
    }

    private void simpleWithMixinPropertiesOverrideResults(EditorForm form) {
        String sectionName = "content";
        List<EditorFormFieldSet> fieldSets = getSection(form, sectionName).getFieldSets();
        Assert.isTrue(fieldSets.size() == 2, "Expected 2 fieldsets but got " + fieldSets.size());

        EditorFormFieldSet fieldSet = getFieldSet(form, sectionName, "jnt:simpleWithMixProperties");
        ArrayList<EditorFormField> fields = new ArrayList<>(fieldSet.getEditorFormFields());
        Assert.isTrue(fields.size() == 3, "Expected 3 fields but receive " + fields.size());
        Assert.isTrue(fields.get(0).getName().equals("propMix1"), "Override of field does not contain propMix1");
        Assert.isTrue(fields.get(0).getMandatory(), "Override of field is not mandatory");
        Assert.isTrue(fields.get(1).getName().equals("prop1"), "Override of field does not contain prop1");
        Assert.isTrue(fields.get(2).getName().equals("prop2"), "Override of field does not contain prop2");

        fieldSet = getFieldSet(form, sectionName, "jmix:mix2");
        fields = new ArrayList<>(fieldSet.getEditorFormFields());
        Assert.isTrue(fields.size() == 1, "Expected 1 fields but receive " + fields.size());
        Assert.isTrue(fields.get(0).getName().equals("propMix2"), "Override of field does not contain propMix2");
    }

    private List<EditorFormFieldValueConstraint> getValueConstraints(final EditorForm form, final String searchedSection,
        final String searchedFieldSet,
        final String searchedField) {
        EditorFormField field = getField(form, searchedSection, searchedFieldSet, searchedField);
        return field.getValueConstraints();
    }

    private void checkHiddenFieldSet(String mixin, String mixinExtend) throws RepositoryException, EditorFormException {
        textNode.addMixin(mixin);
        session.save();
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        EditorFormFieldSet fs = getFieldSet(form, "content", mixin);

        Assert.isTrue(!fs.getDisplayed(), "FieldSet should not be displayed");
        Assert.isTrue(fs.getActivated(), "FieldSet should be activated");
        Assert.isTrue(!fs.getDynamic(), "FieldSet should not be dynamic");

        fs = getFieldSet(form, "content", mixinExtend);

        Assert.isTrue(!fs.getDisplayed(), "FieldSet should not be displayed");
        Assert.isTrue(!fs.getActivated(), "FieldSet should not be activated");
        Assert.isTrue(fs.getDynamic(), "FieldSet should be dynamic");
        // clean up

        textNode.removeMixin(mixin);
        session.save();
    }

    private EditorFormFieldSet readEditorFormFieldSet(String s) {
        EditorFormFieldSet editorFormFieldSet = staticDefinitionsRegistry.readEditorFormFieldSet(getResource(s));
        editorFormFieldSet.setOriginBundle(new DummyBundle(0));
        return editorFormFieldSet;
    }

}
