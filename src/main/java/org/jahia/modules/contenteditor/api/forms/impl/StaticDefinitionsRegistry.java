package org.jahia.modules.contenteditor.api.forms.impl;

import org.apache.commons.lang.StringUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jahia.modules.contenteditor.api.forms.EditorFormDefinition;
import org.jahia.modules.contenteditor.api.forms.EditorFormFieldSet;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleEvent;
import org.osgi.framework.SynchronousBundleListener;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URL;
import java.util.*;

@Component(immediate = true, service = StaticDefinitionsRegistry.class)
public class StaticDefinitionsRegistry implements SynchronousBundleListener {

    private static final Logger logger = LoggerFactory.getLogger(StaticDefinitionsRegistry.class);

    private Map<Bundle, List<EditorFormDefinition>> staticEditorFormDefinitionsByBundle = new LinkedHashMap<>();
    private Map<String, SortedSet<EditorFormDefinition>> staticEditorFormDefinitionsByName = new LinkedHashMap<>();
    private Map<Bundle, List<EditorFormFieldSet>> staticEditorFormFieldSetsByBundle = new LinkedHashMap<>();
    private Map<String, SortedSet<EditorFormFieldSet>> staticEditorFormFieldSetsByName = new LinkedHashMap<>();
    private ObjectMapper objectMapper = new ObjectMapper();
    private BundleContext bundleContext;

    @Activate
    public void activate(BundleContext bundleContext, Map<String, Object> properties) {
        this.bundleContext = bundleContext;
        for (Bundle bundle : bundleContext.getBundles()) {
            if (bundle.getBundleContext() != null) {
                registerStaticEditorFormFieldSets(bundle);
                registerStaticEditorFormDefinitions(bundle);
            }
        }
        bundleContext.addBundleListener(this);
    }

    @Deactivate
    public void deactivate() {
        bundleContext.removeBundleListener(this);
    }

    @Override
    public void bundleChanged(BundleEvent event) {
        switch (event.getType()) {
            case BundleEvent.STARTED:
                registerStaticEditorFormFieldSets(event.getBundle());
                registerStaticEditorFormDefinitions(event.getBundle());
                break;
            case BundleEvent.STOPPED:
                unregisterStaticEditorFormFieldSets(event.getBundle());
                unregisterStaticEditorFormDefinitions(event.getBundle());
        }
    }

    SortedSet<EditorFormFieldSet> getFormFieldSets(String name) {
        return staticEditorFormFieldSetsByName.get(name);
    }

    SortedSet<EditorFormDefinition> getFormDefinitions(String name) {
        return staticEditorFormDefinitionsByName.get(name);
    }

    private void registerStaticEditorFormFieldSets(Bundle bundle) {
        if (bundle.getBundleContext() == null) {
            return;
        }
        Enumeration<URL> editorFormURLs = bundle.findEntries("META-INF/jahia-content-editor-forms/fieldsets", "*.json", true);
        if (editorFormURLs == null) {
            return;
        }
        List<EditorFormFieldSet> bundleEditorFormFieldSets = new ArrayList<>();
        while (editorFormURLs.hasMoreElements()) {
            URL editorFormURL = editorFormURLs.nextElement();
            EditorFormFieldSet editorFormFieldSet = readEditorFormFieldSet(editorFormURL);
            if (editorFormFieldSet != null) {
                editorFormFieldSet.setOriginBundle(bundle);
                bundleEditorFormFieldSets.add(editorFormFieldSet);
            }

        }
        staticEditorFormFieldSetsByBundle.put(bundle, bundleEditorFormFieldSets);
    }

    EditorFormFieldSet readEditorFormFieldSet(URL editorFormURL) {
        EditorFormFieldSet editorFormFieldSet = null;
        try {
            editorFormFieldSet = objectMapper.readValue(editorFormURL, EditorFormFieldSet.class);
            String name = editorFormFieldSet.getName();

            if (StringUtils.isNotBlank(name)) {
                SortedSet<EditorFormFieldSet> editorFormFieldSets = staticEditorFormFieldSetsByName.get(name);
                if (editorFormFieldSets == null) {
                    editorFormFieldSets = new TreeSet<>();
                }
                editorFormFieldSets.add(editorFormFieldSet);
                staticEditorFormFieldSetsByName.put(name, editorFormFieldSets);
                logger.info("Successfully loaded static fieldSets for name {} from {}", name, editorFormURL);
            } else {
                logger.error("Could not serialize the object with the {} from {}", EditorFormFieldSet.class, editorFormURL);
            }
        } catch (IOException e) {
            logger.error("Error loading editor form from " + editorFormURL, e);
        }
        return editorFormFieldSet;
    }

    private void unregisterStaticEditorFormFieldSets(Bundle bundle) {
        List<EditorFormFieldSet> bundleEditorFormFieldSets = staticEditorFormFieldSetsByBundle.remove(bundle);
        if (bundleEditorFormFieldSets == null) {
            return;
        }
        for (EditorFormFieldSet bundleEditorFormFieldSet : bundleEditorFormFieldSets) {
            SortedSet<EditorFormFieldSet> nodeTypeEditorFormFieldSets = staticEditorFormFieldSetsByName.get(bundleEditorFormFieldSet.getName());
            if (nodeTypeEditorFormFieldSets != null) {
                nodeTypeEditorFormFieldSets.remove(bundleEditorFormFieldSet);
                staticEditorFormFieldSetsByName.put(bundleEditorFormFieldSet.getName(), nodeTypeEditorFormFieldSets);
            }
        }
    }

    private void registerStaticEditorFormDefinitions(Bundle bundle) {
        if (bundle.getBundleContext() == null) {
            return;
        }
        Enumeration<URL> editorFormURLs = bundle.findEntries("META-INF/jahia-content-editor-forms/forms", "*.json", true);
        if (editorFormURLs == null) {
            return;
        }
        List<EditorFormDefinition> bundleEditorFormDefinitions = new ArrayList<>();
        while (editorFormURLs.hasMoreElements()) {
            URL editorFormURL = editorFormURLs.nextElement();
            EditorFormDefinition editorFormDefinition = readEditorFormDefinition(editorFormURL);

            if (editorFormDefinition != null) {
                bundleEditorFormDefinitions.add(editorFormDefinition);
                editorFormDefinition.setOriginBundle(bundle);
            }

        }
        staticEditorFormDefinitionsByBundle.put(bundle, bundleEditorFormDefinitions);
    }

    EditorFormDefinition readEditorFormDefinition(URL editorFormURL) {
        EditorFormDefinition editorFormDefinition = null;
        try {
            editorFormDefinition = objectMapper.readValue(editorFormURL, EditorFormDefinition.class);
            String name = editorFormDefinition.getName();

            if (StringUtils.isNotBlank(name)) {
                SortedSet<EditorFormDefinition> editorFormDefinitions = staticEditorFormDefinitionsByName.get(name);
                if (editorFormDefinitions == null) {
                    editorFormDefinitions = new TreeSet<>();
                }
                editorFormDefinitions.add(editorFormDefinition);
                staticEditorFormDefinitionsByName.put(name, editorFormDefinitions);
                logger.info("Successfully loaded static form for name {} from {}", name, editorFormURL);
            } else {
                logger.error("Could not serialize the object with the {} from {}", EditorFormDefinition.class, editorFormURL);
            }
        } catch (IOException e) {
            logger.error("Error loading editor form from " + editorFormURL, e);
        }
        return editorFormDefinition;
    }

    private void unregisterStaticEditorFormDefinitions(Bundle bundle) {
        List<EditorFormDefinition> bundleEditorFormDefinitions = staticEditorFormDefinitionsByBundle.remove(bundle);
        if (bundleEditorFormDefinitions == null) {
            return;
        }
        for (EditorFormDefinition bundleEditorFormDefinition : bundleEditorFormDefinitions) {
            SortedSet<EditorFormDefinition> editorFormDefinitions = staticEditorFormDefinitionsByName.get(bundleEditorFormDefinition.getName());
            if (editorFormDefinitions != null) {
                editorFormDefinitions.remove(bundleEditorFormDefinition);
                staticEditorFormDefinitionsByName.put(bundleEditorFormDefinition.getName(), editorFormDefinitions);
            }
        }
    }

}
