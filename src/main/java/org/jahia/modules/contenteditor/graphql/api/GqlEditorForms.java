package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import org.jahia.modules.contenteditor.api.forms.EditorForm;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
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
    @GraphQLName("formByNodeType")
    @GraphQLDescription("Get a form by a node type name")
    public EditorForm getEditorFormByNodeType(
            @GraphQLName("nodeType")
            @GraphQLDescription("The name identifying the form we want to retrieve")
                    String nodeType,
            @GraphQLName("locale")
            @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
                    String locale,
            @GraphQLName("nodeId")
            @GraphQLDescription("A node identifier (UUID) of an existing node, which will be used to check contraints such as locks. This is optional and may be null or unspecified")
            String existingNodeIdentifier) {
        return editorFormService.getEditorFormByNodeType(nodeType, locale, existingNodeIdentifier);
    }

}
