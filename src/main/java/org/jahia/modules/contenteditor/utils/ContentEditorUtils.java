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
package org.jahia.modules.contenteditor.utils;

import org.apache.commons.lang3.StringUtils;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.nodetypes.ConstraintsHelper;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.ItemNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.*;
import java.util.stream.Stream;

/**
 * Utility class for Content Editor
 */
public class ContentEditorUtils {

    private ContentEditorUtils() {
        // prevent new instance of this class
    }

    private static Logger logger = LoggerFactory.getLogger(ContentEditorUtils.class);

    /**
     * For the given node, return the allowed node types as child node
     *
     * @param currentNode            given node
     * @param childNodeName          the child node name:
     *                               if not null: will check named constraints for this child name
     *                               if null: will check for not named constraints
     * @param useContributeNodeTypes if true, check the contribute property on the node
     * @param filterNodeType         returns nodetypes that match this value
     * @return a Set of nodeTypes name allowed to be set as child node of the given node
     */
    public static Set<String> getAllowedNodeTypesAsChildNode(JCRNodeWrapper currentNode, String childNodeName, boolean useContributeNodeTypes, List<String> filterNodeType) {
        try {
            // look for definition
            Set<String> definitionAllowedTypes = getChildNodeTypes(currentNode, filterNodeType, childNodeName);

            // Filter contribute types
            if (useContributeNodeTypes) {
                Set<String> resolvedContributeTypes = getContributeTypes(currentNode, definitionAllowedTypes);
                if (resolvedContributeTypes != null && !resolvedContributeTypes.isEmpty()) {
                    return resolvedContributeTypes;
                }
            }

            return definitionAllowedTypes;
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }
    }

    private static Set<String> getContributeTypes(JCRNodeWrapper node, Set<String> definitionAllowedTypes) throws RepositoryException {
        if (node.isNodeType("jmix:contributeMode") && node.hasProperty("j:contributeTypes")) {
            Value[] contributeTypes = node.getProperty("j:contributeTypes").getValues();
            Set<String> resolvedContributeTypes = new HashSet<>();
            Arrays.stream(contributeTypes).forEach(type -> definitionAllowedTypes.forEach(allowedType -> {
                    try {
                        if (NodeTypeRegistry.getInstance().getNodeType(type.getString()).isNodeType(allowedType)) {
                            resolvedContributeTypes.add(type.getString());
                        }
                    } catch (RepositoryException e) {
                        throw new DataFetchingException(e);
                    }
                })
            );
            return resolvedContributeTypes;
        } else {
            // recurse on parent to check if contribute types exists
            JCRNodeWrapper parent;
            try {
                parent = node.getParent();
            } catch (ItemNotFoundException e) {
                // no parent anymore
                return Collections.emptySet();
            }
            return getContributeTypes(parent, definitionAllowedTypes);
        }
    }

    private static Set<String> getChildNodeTypes(JCRNodeWrapper node, List<String> filterNodeType, String childNodeName) throws RepositoryException {
        Set<String> allowedTypes = new HashSet<>();
        Set<String> availableTypes = new HashSet<>(ConstraintsHelper.getConstraintSet(node, childNodeName));
        if (availableTypes.isEmpty()) {
            availableTypes.addAll(ConstraintsHelper.getConstraintSet(node));
        }
        availableTypes.forEach(type -> {
                try {
                    ExtendedNodeType nodeType = NodeTypeRegistry.getInstance().getNodeType(type);
                    Stream<ExtendedNodeType> typesToCheck = Stream.concat(nodeType.getSubtypesAsList().stream(), Stream.of(nodeType));
                    typesToCheck.forEach(subTyype -> {
                        getAllowedTypes(allowedTypes, filterNodeType, subTyype);
                    });
                } catch (RepositoryException e) {
                    // ignore unknown type
                }
            });
        return allowedTypes;
    }

    private static void getAllowedTypes(Set<String> allowedTypes, List<String> filterNodeType, ExtendedNodeType subType) {
        if (filterNodeType != null) {
            filterNodeType.forEach(filterType -> {
                if (subType.isNodeType(filterType)) {
                    allowedTypes.add(subType.getName());
                }
            });
        } else {
            allowedTypes.add(subType.getName());
        }
    }

}
