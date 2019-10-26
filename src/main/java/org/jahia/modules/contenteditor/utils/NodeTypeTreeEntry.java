package org.jahia.modules.contenteditor.utils;

import org.apache.commons.lang3.StringUtils;
import org.jahia.services.content.nodetypes.ExtendedNodeType;

import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;

public class NodeTypeTreeEntry implements Comparable<NodeTypeTreeEntry> {
    private String label;
    private String name;
    private ExtendedNodeType nodeType;
    private Set<NodeTypeTreeEntry> children;

    public NodeTypeTreeEntry(ExtendedNodeType nodeType, Locale uiLocale) {
        this.nodeType = nodeType;
        this.name = nodeType.getName();
        this.label = nodeType.getLabel(uiLocale);

    }
    public Set<NodeTypeTreeEntry> getChildren() {
        return children;
    }

    public String getLabel() {
        return label;
    }

    public String getName() {
        return name;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setChildren(Set<NodeTypeTreeEntry> children) {
        this.children = children;
    }

    public void add(NodeTypeTreeEntry entry) {
        if (children == null) {
            children = new TreeSet<>();
        }
        children.add(entry);
    }

    public ExtendedNodeType getNodeType() {
        return nodeType;
    }

    @Override
    public int compareTo(NodeTypeTreeEntry otherNodeTypeTreeEntry) {
        return StringUtils.compareIgnoreCase(getLabel(), otherNodeTypeTreeEntry.getLabel());
    }
}
