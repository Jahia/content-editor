package org.jahia.modules.contenteditor.graphql.api.definitions;

import graphql.annotations.annotationTypes.GraphQLDefaultValue;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import org.jahia.modules.contenteditor.graphql.api.GqlUtils;
import org.jahia.modules.contenteditor.utils.NodeTypeTreeEntry;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.nodetype.GqlJcrNodeType;
import org.jahia.services.content.JCRContentUtils;

import javax.jcr.RepositoryException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * GraphQL representation of a tree of nodetypes
 */


@GraphQLName("NodeTypeTreeEntry")
@GraphQLDescription("GraphQL representation of node type tree entry")
public class GqlNodeTypeTreeEntry {

    private NodeTypeTreeEntry nodeTreeEntry;

    private GqlNodeTypeTreeEntry parent;

    public GqlNodeTypeTreeEntry(NodeTypeTreeEntry entry) {
        this.nodeTreeEntry = entry;
    }

    private GqlNodeTypeTreeEntry(NodeTypeTreeEntry entry, GqlNodeTypeTreeEntry parent) {
        this(entry);
        this.parent = parent;
    }

    @GraphQLField
    @GraphQLDescription("Return nodeType name")
    public String getName() {
        return nodeTreeEntry.getName();
    }

    @GraphQLField
    @GraphQLDescription("Return the parent tree entry (if any)")
    public GqlNodeTypeTreeEntry getParent() {
        return parent;
    }

    @GraphQLField
    @GraphQLDescription("Return nodeType")
    public GqlJcrNodeType getNodeType() {
        return new GqlJcrNodeType(nodeTreeEntry.getNodeType());
    }

    @GraphQLField
    @GraphQLDescription("Return icon URL with png extension")
    public String getIconURL(
        @GraphQLName("addExtension")
        @GraphQLDefaultValue(GqlUtils.SupplierTrue.class)
        @GraphQLDescription("if true (default) add '.png' to the icon path.")
            boolean addExtension
    ) {
        try {
            return JCRContentUtils.getIconWithContext(nodeTreeEntry.getNodeType()) + (addExtension ? ".png" : "");
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }
    }

    @GraphQLField
    @GraphQLDescription("Return the i18n label")
    public String getLabel() {
        return nodeTreeEntry.getLabel();
    }

    @GraphQLField
    @GraphQLDescription("Return the children if any")
    public List<GqlNodeTypeTreeEntry> getChildren() {
        if (nodeTreeEntry.getChildren() == null) {
            return Collections.emptyList();
        }
        return nodeTreeEntry.getChildren().stream().map(entry -> new GqlNodeTypeTreeEntry(entry, this)).collect(Collectors.toList());
    }
}
