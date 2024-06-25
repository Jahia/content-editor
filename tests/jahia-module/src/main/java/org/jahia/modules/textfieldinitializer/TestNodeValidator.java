package org.jahia.modules.textfieldinitializer;

import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.decorator.validation.JCRNodeValidator;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class TestNodeValidator implements JCRNodeValidator {

    private JCRNodeWrapper node;

    public TestNodeValidator(JCRNodeWrapper node) {
        this.node = node;
    }

    @NotEmpty
    public String getDefaultString() {
        return node.getPropertyAsString("defaultString");
    }

    @Size(min = 3)
    public String getDefaultI18nString() {
        return node.getPropertyAsString("defaultI18nString");
    }

}
