package org.jahia.modules.textfieldinitializer;

import org.jahia.services.content.decorator.validation.JCRNodeValidatorDefinition;
import org.osgi.service.component.annotations.Component;

import java.util.Collections;
import java.util.Map;

@Component(service = JCRNodeValidatorDefinition.class)
public class CustomValidators extends JCRNodeValidatorDefinition {
    @Override
    public Map<String, Class> getValidators() {
        return Collections.singletonMap("cent:textFieldInitializer", TestNodeValidator.class);
    }
}
