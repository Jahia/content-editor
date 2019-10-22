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
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

public class EditorFormServiceImplTest extends AbstractJUnitTest {

    private EditorFormService editorFormService;
    private StaticDefinitionsRegistry staticDefinitionsRegistry;

    private JahiaSite testSite;
    private JCRNodeWrapper textNode;
    private JCRNodeWrapper unstructuredNews;
    private JCRNodeWrapper defaultOverrideContent;

    private static JCRSessionWrapper session;


    @Before
    public void beforeEach() throws Exception {
        staticDefinitionsRegistry = new StaticDefinitionsRegistry();
        // init service
        editorFormService = new EditorFormServiceImpl();
        ((EditorFormServiceImpl) editorFormService).setChoiceListInitializerService(ChoiceListInitializerService.getInstance());
        ((EditorFormServiceImpl) editorFormService).setNodeTypeRegistry(NodeTypeRegistry.getInstance());
        ((EditorFormServiceImpl) editorFormService).setStaticDefinitionsRegistry(staticDefinitionsRegistry);

        // init site
        testSite = TestHelper.createSite("editorFormServiceSite");

        // init sessions
        session = JCRSessionFactory.getInstance().getCurrentSystemSession(Constants.EDIT_WORKSPACE, Locale.ENGLISH, Locale.ENGLISH);

        // init render service
        RenderService.getInstance().setScriptResolvers(Collections.emptyList());

        // set default template package
        // Todo: Use mockito to mock ChoiceListInitializer instead of dummy Render Service / Bundle ..
        JahiaTemplatesPackage defaultModule = new JahiaTemplatesPackage(new DummyBundle());
        defaultModule.setName("default");
        defaultModule.setId("default");
        defaultModule.setVersion(new ModuleVersion("1.0.0"));
        ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().register(defaultModule);

        // init static definition registry
        staticDefinitionsRegistry.readEditorFormDefinition(EditorFormServiceImpl.class.getClassLoader().getResource("META-INF/jahia-content-editor-forms/forms/default.json"));

        // create text content
        textNode = session.getNode(testSite.getJCRLocalPath()).addNode("test", "jnt:text");
        session.save();

        // create unstructured content
        unstructuredNews = session.getNode(testSite.getJCRLocalPath()).addNode("unstructuredNews", "jnt:unstructuredNews");
        session.save();

        //create default override content
        defaultOverrideContent = session.getNode(testSite.getJCRLocalPath()).addNode("defaultOverrideContent","jnt:defaultOverrideContent");
        session.save();
    }

    @After
    public void afterEach() throws Exception {
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
        staticDefinitionsRegistry.readEditorFormFieldSet(getResource("META-INF/jahia-content-editor-forms/overrides/fieldSets/jnt_simple_rank_field.json"));
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
    }

    @Test
    public void testSectionOverride() throws Exception {
        // inject custom section
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/overrides/forms/default.json"));

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.getSections().size() == 1, "Override contains more than one section");
        Assert.isTrue(form.getSections().get(0).getName().equals("layout"), "Override does not contains \"layout\" section");
    }

    @Test
    public void testSectionPriorityOverride() throws Exception {
        // inject custom sections
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/overrides/forms/default.json"));
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/overrides/forms/default.priority.json"));
        staticDefinitionsRegistry.readEditorFormDefinition(getResource("META-INF/jahia-content-editor-forms/overrides/forms/default.json"));

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.getSections().size() == 2, "Priority check on section does not contain 2 sections");
        Assert.isTrue(form.getSections().get(0).getName().equals("options") && form.getSections().get(1).getName().equals("content"), "Priority check on section does not contain options then content");
    }

    @Test
    public void testSectionForNodeTypeOverride() throws Exception {
        // inject text override
        staticDefinitionsRegistry.readEditorFormDefinition(
            getResource("META-INF/jahia-content-editor-forms/overrides/forms/jnt_text.json"));

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(form.getSections().size() == 1, "Override contains more than one section");
        Assert.isTrue(form.getSections().get(0).getName().equals("metadata"), "Override does not contains \"metadata\" section");
    }

    @Test
    public void testRemoveFieldSetOverride() throws Exception {

        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        // description is present
        Assert.isTrue(hasFieldSet(form, "metadata", "jmix:description"), "description not found");
        staticDefinitionsRegistry.readEditorFormFieldSet(getResource("META-INF/jahia-content-editor-forms/overrides/fieldSets/jmix_description_remove_fieldset.json"));
        // description is removed
        EditorForm newForm = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        Assert.isTrue(!hasFieldSet(newForm, "metadata", "jmix:description"), "description is found but should not");
    }

    /**
     * Given I define a JSON override next to my mixin cnd definition that set a target for a fieldset: "target":{"itemType":"layout"}
     *
     * When the API for a content type is called
     *
     * Then the API will take the override into account and return the JSON with the fieldset in the right itemType
     *
     * Fields can also support target : "target":{"itemType":"layout", "fieldset":"view" }
     * @throws Exception
     */
    @Test
    public void testMoveFieldSetOverride() throws Exception {
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        // test that tagged is in jmix:tagged
        Assert.isTrue(hasField(form, "metadata", "jmix:tagged", "j:tagList"), "cannot find jmix:tagged in metadata section");
        staticDefinitionsRegistry.readEditorFormFieldSet(getResource("META-INF/jahia-content-editor-forms/overrides/fieldSets/jmix_tagged_move_field.json"));
        EditorForm newForm = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, textNode.getPath());
        // field has been moved
        Assert.isTrue(hasField(newForm, "classification", "jmix:tagged", "j:tagList"), "cannot find jmix:tagged in metadata section");
        Assert.isTrue(!hasFieldSet(newForm, "metadata", "jmix:tagged"), "cannot find jmix:tagged in metadata section");
    }

    @Test
    public void testUnstructuredFieldSetOverride() throws Exception {
        staticDefinitionsRegistry.readEditorFormFieldSet(getResource("META-INF/jahia-content-editor-forms/overrides/fieldSets/jnt_unstructuredNews.json"));
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, unstructuredNews.getPath());
        Assert.isTrue(hasField(form, "content", "jnt:unstructuredNews", "text"), "cannot find jmix:tagged in metadata section");
        Assert.isTrue(hasField(form, "content", "jnt:unstructuredNews", "description"), "cannot find jmix:tagged in metadata section");


    }

    @Test
    public void testOverrides() throws Exception {
        //First, check if the concerned fields are present
        EditorForm form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, defaultOverrideContent.getPath());
        Assert.isTrue(hasField(form, "options", "jmix:cache", "j:expiration"), "could find jmix:cache in options section");
        Assert.isTrue(hasField(form, "options", "jmix:cache", "j:perUser"), "could find jmix:cache in options section");
        Assert.isTrue(hasField(form, "classification", "jmix:categorized", "j:defaultCategory"), "could find jmix:categorized in classification section");
        Assert.isTrue(hasField(form, "metadata", "jmix:keywords", "j:keywords"), "could find jmix:tags in options section");

        //Reading the overrides json files
        staticDefinitionsRegistry.readEditorFormFieldSet(getResource("META-INF/jahia-content-editor-forms/overrides/fieldSets/jmix_cache.json"));
        staticDefinitionsRegistry.readEditorFormFieldSet(getResource("META-INF/jahia-content-editor-forms/overrides/fieldSets/jmix_categorized.json"));
        staticDefinitionsRegistry.readEditorFormFieldSet(getResource("META-INF/jahia-content-editor-forms/overrides/fieldSets/jmix_keywords.json"));
        form = editorFormService.getEditForm(Locale.ENGLISH, Locale.ENGLISH, defaultOverrideContent.getPath());

        //Checking if the fields disappeared
        Assert.isTrue(!hasField(form, "options", "jmix:cache", "j:expiration"), "could find jmix:cache in options section");
        Assert.isTrue(!hasField(form, "options", "jmix:cache", "j:perUser"), "could find jmix:cache in options section");
        Assert.isTrue(!hasField(form, "classification", "jmix:categorized", "j:defaultCategory"), "could find jmix:categorized in classification section");
        Assert.isTrue(!hasField(form, "metadata", "jmix:keywords", "j:keywords"), "could find jmix:tags in options section");
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
        if (formFieldSets.size() > 0) {
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
        if (fields.size() > 0) {
            return fields.get(0);
        } else {
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
}
