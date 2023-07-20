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
package org.jahia.modules.contenteditor.graphql.api.forms;

import graphql.annotations.annotationTypes.*;
import org.jahia.api.Constants;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.contenteditor.api.forms.EditorFormException;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
import org.jahia.modules.contenteditor.api.forms.model.Form;
import org.jahia.modules.contenteditor.graphql.api.GqlUtils;
import org.jahia.modules.contenteditor.graphql.api.definitions.GqlNodeTypeTreeEntry;
import org.jahia.modules.contenteditor.graphql.api.types.ContextEntryInput;
import org.jahia.modules.contenteditor.utils.ContentEditorUtils;
import org.jahia.modules.graphql.provider.dxm.osgi.annotations.GraphQLOsgiService;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.utils.LanguageCodeConverters;
import org.jahia.utils.NodeTypeTreeEntry;
import org.jahia.utils.NodeTypesUtils;
import org.osgi.framework.Bundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import java.util.*;
import java.util.stream.Collectors;

/**
 * The root class for the GraphQL form API
 */
public class GqlEditorForms {

    private static Logger logger = LoggerFactory.getLogger(GqlEditorForms.class);

    private EditorFormService editorFormService;

    @Inject
    @GraphQLOsgiService
    public void setEditorFormService(EditorFormService editorFormService) {
        this.editorFormService = editorFormService;
    }

    @GraphQLField
    @GraphQLName("createForm")
    @GraphQLDescription("Get a editor form to create a new content from its nodetype and parent")
    public GqlEditorForm getCreateForm(
        @GraphQLName("primaryNodeType") @GraphQLNonNull @GraphQLDescription("The primary node type name identifying the form we want to retrieve") String nodeType,
        @GraphQLName("uiLocale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String uiLocale,
        @GraphQLName("locale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String locale,
        @GraphQLName("uuidOrPath") @GraphQLNonNull @GraphQLDescription("uuid or path of an existing node under with the new content will be created.") String uuidOrPath)
        throws EditorFormException {
        Form form = editorFormService.getCreateForm(nodeType, uuidOrPath, LanguageCodeConverters.getLocaleFromCode(uiLocale), LanguageCodeConverters.getLocaleFromCode(locale));
        return new GqlEditorForm(form);
    }

    @GraphQLField
    @GraphQLName("editForm")
    @GraphQLDescription("Get a editor form from a locale and an existing node")
    public GqlEditorForm getEditForm(
        @GraphQLName("uiLocale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String uiLocale,
        @GraphQLName("locale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String locale,
        @GraphQLName("uuidOrPath") @GraphQLNonNull @GraphQLDescription("UUID or path of an existing node under with the new content will be created.") String uuidOrPath)
        throws EditorFormException {
        Form form = editorFormService.getEditForm(uuidOrPath, LanguageCodeConverters.getLocaleFromCode(uiLocale), LanguageCodeConverters.getLocaleFromCode(locale));
        return new GqlEditorForm(form);
    }

    @GraphQLField
    @GraphQLName("fieldConstraints")
    @GraphQLDescription("Get field constraints")
    public List<GqlEditorFormValueConstraint> getFieldConstraints(
        @GraphQLName("nodeUuidOrPath") @GraphQLDescription("UUID or path of the node (optional in case you are creating it, and it doesnt exist yet)") String nodeUuidOrPath,
        @GraphQLName("parentNodeUuidOrPath") @GraphQLNonNull @GraphQLDescription("UUID or path of the parent node") String parentNodeUuidOrPath,
        @GraphQLName("primaryNodeType") @GraphQLNonNull @GraphQLDescription("A string representation of the primary node type of the node") String primaryNodeType,
        @GraphQLName("fieldNodeType") @GraphQLNonNull @GraphQLDescription("A string representation of the field node type (the node type that contains the field, can be the node type of the node, a mixin or a super type)") String fieldNodeType,
        @GraphQLName("fieldName") @GraphQLNonNull @GraphQLDescription("A string representation of field name") String fieldName,
        @GraphQLName("context") @GraphQLDescription("Object contains additional information of the node") List<ContextEntryInput> context,
        @GraphQLName("uiLocale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String uiLocale,
        @GraphQLName("locale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String locale)
        throws EditorFormException {
        return editorFormService.getFieldConstraints(nodeUuidOrPath, parentNodeUuidOrPath, primaryNodeType, fieldNodeType, fieldName, context, LanguageCodeConverters.getLocaleFromCode(uiLocale), LanguageCodeConverters.getLocaleFromCode(locale)).stream()
            .map(GqlEditorFormValueConstraint::new).collect(Collectors.toList());
    }

    @GraphQLField
    @GraphQLName("contentTypesAsTree")
    @GraphQLDescription("Get a list of allowed child nodeTypes for a given nodeType and path. (Note that it returns nothing for type [jnt:page]. [jnt:contentFolder] is filterered by [jmix:editorialContent])")
    public List<GqlNodeTypeTreeEntry> getContentTypesAsTree(
        @GraphQLName("nodeTypes") @GraphQLDescription("List of types we want to retrieve, null for all") List<String> nodeTypes,
        @GraphQLName("childNodeName") @GraphQLDescription("the child node name, used to check the type allowed for this named child node, do not specify if you want to check for unnamed children") String childNodeName,
        @GraphQLName("excludedNodeTypes") @GraphQLDescription("List of types we want to exclude, null for all") List<String> excludedNodeTypes,
        @GraphQLName("includeSubTypes") @GraphQLDefaultValue(GqlUtils.SupplierTrue.class) @GraphQLDescription("if true, retrieves all the sub types of the given node types, if false, returns the type only. Default value is true") boolean includeSubTypes,
        @GraphQLName("useContribute") @GraphQLDefaultValue(GqlUtils.SupplierTrue.class) @GraphQLDescription("if true, check the contribute property of the node. Default value is true") boolean useContribute,
        @GraphQLName("nodePath") @GraphQLNonNull @GraphQLDescription("thPath of an existing node under with the new content will be created.") String nodePath,
        @GraphQLName("uiLocale") @GraphQLNonNull @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...") String uiLocale)
        throws RepositoryException {
        JCRNodeWrapper parentNode = getSession().getNode(nodePath);

        // Only jmix:editorialContent on jnt:contentFolder
        if (parentNode.isNodeType("jnt:contentFolder") && (nodeTypes == null || nodeTypes.isEmpty())) {
            nodeTypes = Collections.singletonList("jmix:droppableContent");
        }
        // check write access
        if (!parentNode.hasPermission("jcr:addChildNodes")) {
            return Collections.emptyList();
        }
        final String nodeIdentifier = parentNode.getIdentifier();
        Locale locale = LanguageCodeConverters.getLocaleFromCode(uiLocale);
        List<String> allowedNodeTypes = new ArrayList<>(ContentEditorUtils.getAllowedNodeTypesAsChildNode(parentNode, childNodeName, useContribute, includeSubTypes, nodeTypes));
        Set<NodeTypeTreeEntry> entries = NodeTypesUtils.getContentTypesAsTree(allowedNodeTypes, excludedNodeTypes, includeSubTypes, nodePath, getSession(locale), locale);
        return entries.stream().map(entry -> new GqlNodeTypeTreeEntry(entry, nodeIdentifier)).collect(Collectors.toList());
    }

    @GraphQLField
    @GraphQLName("ckeditorConfigPath")
    @GraphQLDescription("Retrieve the custom configuration path for CKEditor")
    public String ckeditorConfigPath(@GraphQLName("nodePath") @GraphQLDescription("node path") String nodePath) throws RepositoryException {
        String configPath;
        // Retrieve custom configuration from template set module
        try {
            String templatesSet = getSession().getNode(nodePath).getResolveSite().getPropertyAsString("j:templatesSet");
            configPath = getConfigPath(templatesSet, "/javascript/ckeditor_config.js");
        } catch (PathNotFoundException e) {
            configPath = "";
        }

        // Otherwise, retrieve custom configuration from global configuration
        if (configPath.isEmpty()) {
            configPath = getConfigPath("ckeditor", "/javascript/config.js");
        }

        return configPath;
    }

    @GraphQLField
    @GraphQLName("ckeditorToolbar")
    @GraphQLDescription("Retrieve the toolbar type for CKEditor")
    public String ckeditorToolbar(@GraphQLName("nodePath") @GraphQLDescription("node path") String nodePath) throws RepositoryException {
        String toolbar = "Light";
        try {
            JCRNodeWrapper node = getSession().getNode(nodePath);
            if (node.hasPermission("view-full-wysiwyg-editor")) {
                toolbar = "Full";
            } else if (node.hasPermission("view-basic-wysiwyg-editor")) {
                toolbar = "Basic";
            }
        } catch (PathNotFoundException e) {
            logger.debug("Path does not exist {}", nodePath);
        }

        return toolbar;
    }

    @GraphQLField
    @GraphQLName("subContentsCount")
    @GraphQLDescription("Retrieve the number of sub contents under the node for given types")
    public Integer subContentsCounts(
        @GraphQLName("nodePath") @GraphQLDescription("node path") String nodePath,
        @GraphQLName("includeTypes") @GraphQLDescription("List of node types to check for") List<String> nodeTypes,
        @GraphQLName("limit") @GraphQLDescription("Limit of sub contents count") Integer limit)
        throws RepositoryException {
        int count = 0;

        JCRSessionWrapper session = getSession();
        JCRNodeWrapper node = session.getNode(nodePath);

        // no need for queries if node doesnt have children
        if (!node.hasNodes()) {
            return count;
        }

        QueryManager queryManager = session.getWorkspace().getQueryManager();
        for (String type : nodeTypes) {
            count += queryManager.createQuery("SELECT count " + "AS [rep:count()] " + "FROM [" + type + "] " + "WHERE isdescendantnode(['" + JCRContentUtils.sqlEncode(node.getPath()) + "'])", Query.JCR_SQL2).execute().getRows().nextRow().getValue("count").getLong();
            if (limit != null && limit > 0 && count >= limit) {
                return limit;
            }
        }

        return count;
    }

    private String getConfigPath(String moduleId, String resource) {
        String configPath = "";
        JahiaTemplatesPackage ckeditorModule = ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageById(moduleId);

        if (ckeditorModule != null) {
            Bundle ckeditorBundle = ckeditorModule.getBundle();

            if (ckeditorBundle != null && ckeditorBundle.getResource(resource) != null) {
                configPath = "$context" + ckeditorModule.getRootFolderPath() + resource;
            }
        }
        return configPath;
    }

    private JCRSessionWrapper getSession() throws RepositoryException {
        return JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE);
    }

    private JCRSessionWrapper getSession(Locale locale) throws RepositoryException {
        if (locale == null) {
            return getSession();
        }
        return JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE, locale);
    }
}
