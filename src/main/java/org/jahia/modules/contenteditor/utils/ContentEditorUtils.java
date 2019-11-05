package org.jahia.modules.contenteditor.utils;

import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.ExtendedNodeDefinition;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import javax.jcr.nodetype.NodeTypeIterator;
import java.util.*;
import java.util.stream.Collectors;
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
     * Utility method that build a list of jmix:droppableContent nodeTypes for a given path as a tree.
     * @param nodeTypes is a list of nodeTypes to return.
     * @param excludedNodeTypes is a list of nodeTypes to filter out.
     * @param includeSubTypes is a boolean, if true it checks the nodeTypes' sub types.
     * @param path on witch we check the available types.
     * @param session JCR Session
     * @param uiLocale current UI locale
     * @return a list of trees of jmix:droppableContent nodeTypes for a given path.
     * @throws RepositoryException
     */
    public static Set<NodeTypeTreeEntry> getContentTypesAsTree(List<String> nodeTypes, final List<String> excludedNodeTypes, final boolean includeSubTypes, String path, JCRSessionWrapper session, Locale uiLocale) throws RepositoryException {
        List<JahiaTemplatesPackage> packages = new ArrayList<JahiaTemplatesPackage>();
        JCRSiteNode site = session.getNode(path).getResolveSite();
        if (site.isNodeType("jnt:module")) {
            packages.add(site.getTemplatePackage());
        } else {
            for (String s : site.getInstalledModules()) {
                JahiaTemplatesPackage aPackage = ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageById(s);
                packages.add(aPackage);
            }
        }

        for (int i = 0; i < packages.size(); i++) {
            JahiaTemplatesPackage aPackage = packages.get(i);
            if (aPackage != null) {
                for (JahiaTemplatesPackage dep : aPackage.getDependencies()) {
                    if (!packages.contains(dep)) {
                        packages.add(dep);
                    }
                }
            }
        }

        List<ExtendedNodeType> types = new ArrayList<>();
        for (JahiaTemplatesPackage pkg : packages) {
            if (pkg != null) {
                for (NodeTypeIterator nti = NodeTypeRegistry.getInstance().getNodeTypes(pkg.getId()); nti.hasNext(); ) {
                    ExtendedNodeType extendedNodeType = (ExtendedNodeType) nti.nextNodeType();
                    if (isValidNodeType(extendedNodeType, nodeTypes, excludedNodeTypes, includeSubTypes, site)) {
                        types.add(extendedNodeType);
                    }
                }
                if (pkg.isDefault()) {
                    for (NodeTypeIterator nti = NodeTypeRegistry.getInstance().getNodeTypes("system-jahia"); nti.hasNext(); ) {
                        ExtendedNodeType extendedNodeType = (ExtendedNodeType) nti.nextNodeType();
                        if (isValidNodeType(extendedNodeType, nodeTypes, excludedNodeTypes, includeSubTypes, site)) {
                            types.add(extendedNodeType);
                        }
                    }
                }
            }
        }

        Map<ExtendedNodeType, List<ExtendedNodeType>> r = new HashMap<ExtendedNodeType, List<ExtendedNodeType>>();
        for (ExtendedNodeType nt : types) {
            if (!nt.isMixin() && !nt.isAbstract()) {
                ExtendedNodeType parent = findFolder(nt);
                if (!r.containsKey(parent)) {
                    r.put(parent, new ArrayList<>());
                }
                r.get(parent).add(nt);
            }
        }

        Set<NodeTypeTreeEntry> roots = new TreeSet<>();
        for (Map.Entry<ExtendedNodeType, List<ExtendedNodeType>> entry : r.entrySet()) {
            ExtendedNodeType entryType = entry.getKey() != null ? entry.getKey() : NodeTypeRegistry.getInstance().getNodeType("nt:base");
            NodeTypeTreeEntry nt = new NodeTypeTreeEntry(entryType, uiLocale);
            roots.add(nt);

            List<NodeTypeTreeEntry> children = new ArrayList<>(entry.getValue().size());
            for (ExtendedNodeType type : entry.getValue()) {
                children.add(new NodeTypeTreeEntry(type, uiLocale));
            }

            disambiguateLabels(children);

            for (NodeTypeTreeEntry type : children) {
                nt.add(type);
            }
        }

        if (roots.size() == 1 && (roots.iterator().next().getNodeType().isMixin() || roots.iterator().next().getName().equals("nt:base"))) {
            Set<NodeTypeTreeEntry> l = roots.iterator().next().getChildren();
            roots.clear();
            roots.addAll(l);
        }

        return roots;
    }

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
            Set<String> allowedTypes = getChildNodeTypes(currentNode.getPrimaryNodeType(), filterNodeType);

            // look for mixin
            Arrays.stream(currentNode.getMixinNodeTypes()).forEach(type -> allowedTypes.addAll(getChildNodeTypes(type, filterNodeType)));
            // Filter contribute types
            Set<String> resolvedContributeTypes = new HashSet<>();
            if (useContributeNodeTypes &&
                currentNode.isNodeType("jmix:contributeMode") &&
                currentNode.hasProperty("j:contributeTypes")) {
                Value[] contributeTypes = currentNode.getProperty("j:contributeTypes").getValues();
                Arrays.stream(contributeTypes).forEach(type -> allowedTypes.forEach(allowedType -> {
                        try {
                            if (NodeTypeRegistry.getInstance().getNodeType(type.getString()).isNodeType(allowedType)) {
                                resolvedContributeTypes.add(type.getString());
                            }
                        } catch (RepositoryException e) {
                            throw new DataFetchingException(e);
                        }
                    })
                );
            }
            return resolvedContributeTypes.isEmpty() ? allowedTypes : resolvedContributeTypes;
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }

    }

    private static Set<String> getChildNodeTypes(ExtendedNodeType nodeType, List<String> filterNodeType) {
        Set<String> allowedTypes = new HashSet<>();
        Arrays.stream(nodeType.getChildNodeDefinitions())
            .filter(ExtendedNodeDefinition::isNode)
            .forEach(definition ->
                Arrays.stream(definition.getRequiredPrimaryTypes())
                    .forEach(type ->
                        allowedTypes.addAll(Stream.concat(type.getSubtypesAsList().stream(), Stream.of(type))
                            .filter(subType -> filterNodeType == null || filterNodeType.stream().anyMatch(subType::isNodeType))
                            .map(ExtendedNodeType::getName)
                            .collect(Collectors.toList()))
                    ));
        return allowedTypes;
    }

    private static ExtendedNodeType findFolder(ExtendedNodeType nt) {
        if (!"jmix:droppableContent".equals(nt.getName()) && nt.isNodeType("jmix:droppableContent")) {
            if (logger.isDebugEnabled()) {
                logger.debug("Detected component type {}", nt.getName());
            }

            ExtendedNodeType[] supertypes = nt.getSupertypes();
            for (int i = supertypes.length - 1; i >= 0; i--) {
                ExtendedNodeType st = supertypes[i];
                if (st.isMixin() && !st.getName().equals("jmix:droppableContent")
                    && st.isNodeType("jmix:droppableContent")) {
                    return st;
                }
            }
        }
        return null;
    }

    private static boolean isValidNodeType(ExtendedNodeType ent, List<String> nodeTypes, List<String> excludedNodeTypes, boolean includeSubTypes, JCRNodeWrapper node) throws RepositoryException {
        if (ent == null) {
            return false;
        }

        if (includeSubTypes) {
            if (isNodeType(nodeTypes, ent) && checkPermissionForType(ent, node)) {
                return excludedNodeTypes == null || !isNodeType(excludedNodeTypes, ent);
            }
        } else {
            if (nodeTypes == null) {
                return false;
            }
            for (String nodeType : nodeTypes) {
                if (ent.getName().equals(nodeType) && checkPermissionForType(ent, node)) {
                    return excludedNodeTypes == null || !isNodeType(excludedNodeTypes, ent);
                }
            }
        }
        return false;
    }

    private static boolean checkPermissionForType(ExtendedNodeType type, JCRNodeWrapper node) throws NoSuchNodeTypeException {
        ExtendedNodeType[] supertypesArray = type.getSupertypes();
        if (supertypesArray.length == 0) {
            // nothing to check
            return true;
        }
        Set<ExtendedNodeType> superTypes = new HashSet<>(supertypesArray.length);
        superTypes.addAll(Arrays.asList(supertypesArray));
        NodeTypeIterator it = NodeTypeRegistry.getInstance().getNodeType("jmix:accessControllableContent").getDeclaredSubtypes();

        boolean allowed = true;
        while (it.hasNext()) {
            ExtendedNodeType next = (ExtendedNodeType) it.next();
            if (superTypes.contains(next)) {
                allowed = node.hasPermission("component-" + next.getName().replace(":", "_"));
                // Keep only last (nearest) accessControllableContent mixin if type inherits from multiple ones, so continue looping
            }
        }
        return allowed;
    }

    private static boolean isNodeType(List<String> nodeTypes, ExtendedNodeType type) {
        return nodeTypes == null || nodeTypes.stream().anyMatch(type::isNodeType);
    }

    /*
     * Appends its name to a {@link GWTJahiaNodeType}'s label for disambiguation if any sibling has the same one.
     */
    private static Collection<NodeTypeTreeEntry> disambiguateLabels(Collection<NodeTypeTreeEntry> nodeTypes) {
        List<NodeTypeTreeEntry> ambiguousNodeTypes = nodeTypes
            .stream()
            .collect(Collectors.groupingBy(NodeTypeTreeEntry::getLabel))
            .values()
            .stream()
            .filter(l -> l.size() > 1)
            .flatMap(List::stream)
            .collect(Collectors.toList());

        for (NodeTypeTreeEntry nodeType : ambiguousNodeTypes) {
            nodeType.setLabel(nodeType.getLabel() + " (" + nodeType.getName() + ")");
        }
        return nodeTypes;
    }

}
