package org.jahia.modules.textfieldinitializer;

import org.apache.jackrabbit.value.ValueFactoryImpl;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.initializers.ValueInitializer;

import javax.jcr.Value;
import java.util.List;

/**
 * Custom dynamic value initializer from a module
 */
public class InitTextValue implements ValueInitializer {
    @Override
    public Value[] getValues(ExtendedPropertyDefinition declaringPropertyDefinition, List<String> params) {
        return new Value[]{ ValueFactoryImpl.getInstance().createValue("test value") };
    }
}
