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
     * @param useContributeNodeTypes if true, check the contribute property on the node
     * @param filterNodeType         returns nodetypes that match this value
     * @return a Set of nodeTypes name allowed to be set as child node of the given node
     */
    public static Set<String> getAllowedNodeTypesAsChildNode(JCRNodeWrapper currentNode, boolean useContributeNodeTypes, List<String> filterNodeType) {
        try {
            // look for definition
            Set<String> definitionAllowedTypes = getChildNodeTypes(currentNode, filterNodeType);

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

    private static Set<String> getChildNodeTypes(JCRNodeWrapper node, List<String> filterNodeType) throws RepositoryException {
        Set<String> allowedTypes = new HashSet<>();
        Arrays.stream(StringUtils.split(ConstraintsHelper.getConstraints(node), " "))
            .forEach(type -> {
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
