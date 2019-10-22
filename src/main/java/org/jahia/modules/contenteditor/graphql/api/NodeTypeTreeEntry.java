package org.jahia.modules.contenteditor.graphql.api;

import org.jahia.services.content.nodetypes.ExtendedNodeType;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

public class NodeTypeTreeEntry {
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
            children = new HashSet<>();
        }
        children.add(entry);
    }

    public ExtendedNodeType getNodeType() {
        return nodeType;
    }
}
