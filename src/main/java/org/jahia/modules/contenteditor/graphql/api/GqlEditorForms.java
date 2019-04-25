package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLNonNull;
import org.apache.commons.lang.LocaleUtils;
import org.jahia.modules.contenteditor.api.forms.EditorForm;
import org.jahia.modules.contenteditor.api.forms.EditorFormException;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.osgi.BundleUtils;

/**
 * The root class for the GraphQL form API
 */
public class GqlEditorForms {

    private EditorFormService editorFormService = null;

    public GqlEditorForms() {
        this.editorFormService = BundleUtils.getOsgiService(EditorFormService.class, null);
    }

    @GraphQLField
    @GraphQLName("createForm")
    @GraphQLDescription("Get a editor form to create a new content from its nodetype and parent")
    public EditorForm getCreateForm(
        @GraphQLName("nodeType")
        @GraphQLNonNull
        @GraphQLDescription("The name identifying the form we want to retrieve")
            String nodeType,
        @GraphQLName("uiLocale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String uiLocale,
        @GraphQLName("locale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String locale,
        @GraphQLName("parentPath")
        @GraphQLNonNull
        @GraphQLDescription("Path of an existing node under with the new content will be created.")
            String parentPath) {
        try {
            return editorFormService.getCreateForm(nodeType, LocaleUtils.toLocale(uiLocale), LocaleUtils.toLocale(locale), parentPath);
        } catch (EditorFormException e) {
            throw new DataFetchingException(e);
        }
    }

    @GraphQLField
    @GraphQLName("editForm")
    @GraphQLDescription("Get a editor form from a locale and an existing node")
    public EditorForm getEditForm(
        @GraphQLName("uiLocale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String uiLocale,
        @GraphQLName("locale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String locale,
        @GraphQLName("nodePath")
        @GraphQLNonNull
        @GraphQLDescription("Path of an existing node under with the new content will be created.")
            String nodePath) {
        try {
            return editorFormService.getEditorForm(LocaleUtils.toLocale(uiLocale), LocaleUtils.toLocale(locale), nodePath);
        } catch (EditorFormException e) {
            throw new DataFetchingException(e);
        }
    }

}
