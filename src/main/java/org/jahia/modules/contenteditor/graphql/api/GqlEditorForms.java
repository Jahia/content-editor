package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.*;
import org.apache.commons.lang.LocaleUtils;
import org.jahia.api.Constants;
import org.jahia.modules.contenteditor.api.forms.EditorForm;
import org.jahia.modules.contenteditor.api.forms.EditorFormException;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
import org.jahia.modules.contenteditor.graphql.api.definitions.GqlNodeTypeTreeEntry;
import org.jahia.modules.contenteditor.utils.ContentEditorUtils;
import org.jahia.modules.contenteditor.utils.NodeTypeTreeEntry;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.osgi.BundleUtils;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * The root class for the GraphQL form API
 */
public class GqlEditorForms {

    private static Logger logger = LoggerFactory.getLogger(GqlEditorForms.class);

    private EditorFormService editorFormService = null;

    public GqlEditorForms() {
        this.editorFormService = BundleUtils.getOsgiService(EditorFormService.class, null);
    }

    @GraphQLField
    @GraphQLName("createForm")
    @GraphQLDescription("Get a editor form to create a new content from its nodetype and parent")
    public EditorForm getCreateForm(
        @GraphQLName("primaryNodeType")
        @GraphQLNonNull
        @GraphQLDescription("The primary node type name identifying the form we want to retrieve")
            String nodeType,
        @GraphQLName("uiLocale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String uiLocale,
        @GraphQLName("locale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String locale,
        @GraphQLName("parentPath")
        @GraphQLNonNull
        @GraphQLDescription("Path of an existing node under with the new content will be created.")
            String parentPath) {
        try {
            return editorFormService.getCreateForm(nodeType, LocaleUtils.toLocale(uiLocale), LocaleUtils.toLocale(locale), parentPath);
        } catch (EditorFormException e) {
            throw new DataFetchingException(e);
        }
    }

    @GraphQLField
    @GraphQLName("editForm")
    @GraphQLDescription("Get a editor form from a locale and an existing node")
    public EditorForm getEditForm(
        @GraphQLName("uiLocale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String uiLocale,
        @GraphQLName("locale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String locale,
        @GraphQLName("nodePath")
        @GraphQLNonNull
        @GraphQLDescription("Path of an existing node under with the new content will be created.")
            String nodePath) {
        try {
            return editorFormService.getEditForm(LocaleUtils.toLocale(uiLocale), LocaleUtils.toLocale(locale), nodePath);
        } catch (EditorFormException e) {
            throw new DataFetchingException(e);
        }
    }

    @GraphQLField
    @GraphQLName("contentTypesAsTree")
    @GraphQLDescription("Get a list of allowed child nodeTypes for a given nodeType and path. (Note that it returns nothing for type [jnt:page]. [jnt:contentFolder] is filterered by [jmix:editorialContent])")
    public List<GqlNodeTypeTreeEntry> getContentTypesAsTree(
        @GraphQLName("nodeTypes")
        @GraphQLDescription("List of types we want to retrieve, null for all")
            List<String> nodeTypes,
        @GraphQLName("excludedNodeTypes")
        @GraphQLDescription("List of types we want to exclude, null for all")
            List<String> excludedNodeTypes,
        @GraphQLName("includeSubTypes")
        @GraphQLDefaultValue(GqlUtils.SupplierTrue.class)
        @GraphQLDescription("if true, retrieves all the sub types of the given node types, if false, returns the type only. Default value is true")
            boolean includeSubTypes,
        @GraphQLName("useContribute")
        @GraphQLDefaultValue(GqlUtils.SupplierTrue.class)
        @GraphQLDescription("if true, check the contribute property of the node. Default value is true")
            boolean useContribute,
        @GraphQLName("nodePath")
        @GraphQLNonNull
        @GraphQLDescription("thPath of an existing node under with the new content will be created.")
            String nodePath,
        @GraphQLName("uiLocale")
        @GraphQLNonNull
        @GraphQLDescription("A string representation of a locale, in IETF BCP 47 language tag format, ie en_US, en, fr, fr_CH, ...")
            String uiLocale
    ) {
        try {
            // Todo: BACKLOG-11556
            // Special Content Editor Filters to match CMM behavior
            // No action on jnt:page
            JCRNodeWrapper parentNode = getSession().getNode(nodePath);
            if (parentNode.isNodeType("jnt:page")) {
                return Collections.emptyList();
            }
            // Only jmix:editorialContent on jnt:contentFolder
            if (nodeTypes == null || nodeTypes.isEmpty()) {
                nodeTypes = Collections.singletonList("jmix:editorialContent");
            }
            // check write access
            if (!parentNode.hasPermission("jcr:addChildNodes")) {
                return Collections.emptyList();
            }
            final String nodeIdentifier = parentNode.getIdentifier();
            Locale locale = LocaleUtils.toLocale(uiLocale);
            List<String> allowedNodeTypes = new ArrayList<>(ContentEditorUtils.getAllowedNodeTypesAsChildNode(parentNode, useContribute, nodeTypes));
            Set<NodeTypeTreeEntry> entries = ContentEditorUtils.getContentTypesAsTree(allowedNodeTypes, excludedNodeTypes, includeSubTypes, nodePath, getSession(locale), locale);
            return entries.stream().map(entry -> new GqlNodeTypeTreeEntry(entry, nodeIdentifier)).collect(Collectors.toList());
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }
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
