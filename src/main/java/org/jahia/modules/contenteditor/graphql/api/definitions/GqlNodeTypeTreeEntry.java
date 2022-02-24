/*
 * MIT License
 *
 * Copyright (c) 2002 - 2022 Jahia Solutions Group. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package org.jahia.modules.contenteditor.graphql.api.definitions;

import graphql.annotations.annotationTypes.GraphQLDefaultValue;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import org.jahia.modules.contenteditor.graphql.api.GqlUtils;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.nodetype.GqlJcrNodeType;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.utils.NodeTypeTreeEntry;

import javax.jcr.RepositoryException;
import java.util.Collections;
import java.util.Comparator;
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

    // If present in the query, id is the field used by the Apollo cache as cache key
    private String id;

    public GqlNodeTypeTreeEntry(NodeTypeTreeEntry entry, String identifier) {
        this.nodeTreeEntry = entry;
        this.id = entry.getName() + "-" + identifier;
    }

    private GqlNodeTypeTreeEntry(NodeTypeTreeEntry entry, GqlNodeTypeTreeEntry parent) {
        this.nodeTreeEntry = entry;
        this.id = entry.getName() + "-" + parent.getId();
        this.parent = parent;
    }

    @GraphQLField
    @GraphQLDescription("Return nodeType name")
    public String getName() {
        return nodeTreeEntry.getName();
    }


    @GraphQLField
    @GraphQLDescription("Return uniq identifier for tree entry")
    public String getId() {
        return id;

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
       return nodeTreeEntry.getChildren().stream().sorted(Comparator.comparing(NodeTypeTreeEntry::getLabel)).map(entry -> new GqlNodeTypeTreeEntry(entry, this)).collect(Collectors.toList());
    }
}
