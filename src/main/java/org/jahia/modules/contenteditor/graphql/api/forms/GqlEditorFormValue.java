package org.jahia.modules.contenteditor.graphql.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import org.jahia.modules.contenteditor.api.forms.model.FieldValue;

public class GqlEditorFormValue {
    private FieldValue value;

    public GqlEditorFormValue(FieldValue value) {
        this.value = value;
    }

    @GraphQLField
    @GraphQLDescription("This value's string representation")
    public String getString() {
        return value.getStringValue();
    }

    @GraphQLField
    @GraphQLDescription("The type of this value")
    public String getType() {
        return value.getType();
    }

}
