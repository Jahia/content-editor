package org.jahia.modules.contenteditor.graphql.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import org.jahia.modules.contenteditor.api.forms.model.FieldValueConstraint;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class GqlEditorFormValueConstraint {

    private FieldValueConstraint constraint;

    public GqlEditorFormValueConstraint(FieldValueConstraint constraint) {
        this.constraint = constraint;
    }

    @GraphQLField
    @GraphQLDescription("The value as it is intended to be displayed in UIs")
    public String getDisplayValue() {
        return constraint.getDisplayValue();
    }

    @GraphQLField
    @GraphQLDescription("The key of the value to get the translated value from the client side")
    public String getDisplayValueKey() {
        return constraint.getDisplayValueKey();
    }

    @GraphQLField
    @GraphQLDescription("The actual value to be used in storage")
    public GqlEditorFormValue getValue() {
        return new GqlEditorFormValue(constraint.getValue());
    }

    @GraphQLField
    @GraphQLDescription("The properties for the value")
    public List<GqlEditorFormProperty> getProperties() {
        if (constraint.getPropertyList() != null) {
            return constraint.getPropertyList().stream().map(p -> new GqlEditorFormProperty(p.getName(), p.getValue())).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

}
