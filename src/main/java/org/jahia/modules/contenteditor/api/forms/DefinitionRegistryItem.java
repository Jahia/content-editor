package org.jahia.modules.contenteditor.api.forms;

import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.osgi.framework.Bundle;

public interface DefinitionRegistryItem {
    double getPriority();

    ExtendedNodeType getNodeType();

    Bundle getOriginBundle();
}
