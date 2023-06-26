package org.jahia.modules.contenteditor.api.forms;

import org.jahia.services.content.nodetypes.ExtendedNodeType;

import java.util.Comparator;

public class DefinitionRegistryItemComparator implements Comparator<DefinitionRegistryItem> {
    public static final DefinitionRegistryItemComparator INSTANCE = new DefinitionRegistryItemComparator();

    @Override
    public int compare(DefinitionRegistryItem o1, DefinitionRegistryItem o2) {
        if (o1 == o2) {
            return 0;
        }

        if (o2 == null) {
            return -1;
        }

        if (o1.getPriority().doubleValue() != o2.getPriority().doubleValue()) {
            return Double.compare(o1.getPriority() , o2.getPriority());
        }

        final ExtendedNodeType nodeType = o1.getNodeType();
        final ExtendedNodeType otherNodeType = o2.getNodeType();
        if (!nodeType.equals(otherNodeType)) {
            if (nodeType.isNodeType(otherNodeType.getName())) {
                return 1;
            }
            if (otherNodeType.isNodeType(nodeType.getName())) {
                return -1;
            }
            // put types that not inherit to the end (as they are set as mixin to an existing node)
            return 1;
        }

        int result = 0;
        if (o1.getOriginBundle() == null) {
            if (o2.getOriginBundle() != null) {
                result = -1;
            }
        } else if (o2.getOriginBundle() == null) {
            result = 1;
        } else {
            result = o1.getOriginBundle().compareTo(o2.getOriginBundle());
        }
        if (result != 0) {
            return result;
        }

        return 1;
    }
}
