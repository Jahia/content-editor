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
