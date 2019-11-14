/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2019 Jahia Solutions Group SA. All rights reserved.
 *
 *     THIS FILE IS AVAILABLE UNDER TWO DIFFERENT LICENSES:
 *     1/GPL OR 2/JSEL
 *
 *     1/ GPL
 *     ==================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE GPL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 *     2/ JSEL - Commercial and Supported Versions of the program
 *     ===================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE JSEL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     Alternatively, commercial and supported versions of the program - also known as
 *     Enterprise Distributions - must be used in accordance with the terms and conditions
 *     contained in a separate written agreement between you and Jahia Solutions Group SA.
 *
 *     If you are unsure which license is appropriate for your use,
 *     please contact the sales department at sales@jahia.com.
 */
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
        return nodeTreeEntry.getChildren().stream().map(entry -> new GqlNodeTypeTreeEntry(entry, this)).collect(Collectors.toList());
    }
}
