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
package org.jahia.modules.contenteditor.graphql.extensions;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLTypeExtension;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrNode;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.jahia.utils.LanguageCodeConverters;

import javax.jcr.RepositoryException;

/**
 * Content Editor JCR Node extension
 */
@GraphQLTypeExtension(GqlJcrNode.class)
public class JCRNodeContentEditorExtensions {

    private GqlJcrNode node;

    public JCRNodeContentEditorExtensions(GqlJcrNode node) {
        this.node = node;
    }

    @GraphQLField
    @GraphQLDescription("Returns edit lock status of the current node object")
    public boolean isLockedAndCannotBeEdited() {
        try {
            return JCRContentUtils.isLockedAndCannotBeEdited(node.getNode());
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }
    }

    @GraphQLField
    @GraphQLName("findAvailableNodeName")
    @GraphQLDescription("Returns the next available name for a node, appending if needed numbers.")
    public String findAvailableNodeName(@GraphQLName("nodeType") String nodeTypeName, @GraphQLName("language") String language) {
        try {
            ExtendedNodeType nodeType = NodeTypeRegistry.getInstance().getNodeType(nodeTypeName);

            return JCRContentUtils.findAvailableNodeName(node.getNode(), JCRContentUtils.generateNodeName(nodeType.getLabel(
                LanguageCodeConverters.languageCodeToLocale(language))));
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }

    }

}
