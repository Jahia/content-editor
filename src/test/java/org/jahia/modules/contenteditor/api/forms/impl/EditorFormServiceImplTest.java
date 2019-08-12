package org.jahia.modules.contenteditor.api.forms.impl;

import org.eclipse.core.runtime.Assert;
import org.jahia.api.Constants;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.contenteditor.api.forms.EditorForm;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
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

public class EditorFormServiceImplTest extends AbstractJUnitTest {

    private EditorFormService editorFormService;
    private StaticDefinitionsRegistry staticDefinitionsRegistry;

    private JahiaSite testSite;
    private JCRNodeWrapper textNode;
    private JCRNodeWrapper unstructuredNews;

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

    }

    @After
    public void afterEach() throws Exception {
        TestHelper.deleteSite(testSite.getSiteKey());
        JCRSessionFactory.getInstance().closeAllSessions();
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

    private URL getResource(String s) {
        return getClass().getClassLoader().getResource(s);
    }


    private boolean hasFieldSet(EditorForm form, final String searchedSection, final String searchedFieldSet) {
        return form.getSections().stream().filter(section -> section.getName().equals(searchedSection)).findFirst().get()
            .getFieldSets().stream().filter(fieldSets -> fieldSets.getName().equals(searchedFieldSet)).findFirst().isPresent();
    }

    private boolean hasField(EditorForm form, final String searchedSection, final String searchedFieldSet, final String searchedField) {
        return form.getSections().stream().filter(section -> section.getName().equals(searchedSection)).findFirst().get()
            .getFieldSets().stream().filter(fieldSets -> fieldSets.getName().equals(searchedFieldSet)).findFirst().get()
            .getEditorFormFields().stream().filter(field -> field.getName().equals(searchedField)).findFirst().isPresent();
    }
}
