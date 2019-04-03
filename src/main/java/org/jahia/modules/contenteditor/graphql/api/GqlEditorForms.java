package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
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
    @GraphQLName("form")
    @GraphQLDescription("Get a form by a node type name, locale, existing node and/or parent node")
    public EditorForm getEditorForm(
            @GraphQLName("nodeType")
            @GraphQLDescription("The name identifying the form we want to retrieve")
                    String nodeType,
            @GraphQLName("uiLocale")
            @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
                    String uiLocale,
            @GraphQLName("locale")
            @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
                    String locale,
            @GraphQLName("nodeIdOrPath")
            @GraphQLDescription("A node identifier (UUID) or path of an existing node, which will be used to check contraints such as locks. This is optional and may be null or unspecified")
                    String existingNodeIdOrPath,
            @GraphQLName("parentNodeIdOrPath")
            @GraphQLDescription("Node identifier (UUID) or path of the parent node of an existing node or where we will create the new node")
                    String parentNodeIdOrPath) {
        try {
            return editorFormService.getEditorForm(nodeType, LocaleUtils.toLocale(uiLocale), LocaleUtils.toLocale(locale),
                    existingNodeIdOrPath, parentNodeIdOrPath);
        } catch (EditorFormException e) {
            throw new DataFetchingException(e);
        }
    }

}
