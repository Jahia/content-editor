package org.jahia.modules.contenteditor.api.forms.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
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

@Component(immediate = true, service = StaticFormFieldSetRegistry.class)
public class StaticFormFieldSetRegistry implements SynchronousBundleListener {

    private static final Logger logger = LoggerFactory.getLogger(StaticFormFieldSetRegistry.class);

    private Map<Bundle, List<EditorFormFieldSet>> staticEditorFormsByBundle = new LinkedHashMap<>();
    private Map<String, SortedSet<EditorFormFieldSet>> staticEditorFormsByNodeType = new LinkedHashMap<>();
    private ObjectMapper objectMapper = new ObjectMapper();
    private BundleContext bundleContext;

    @Activate
    public void activate(BundleContext bundleContext, Map<String, Object> properties) {
        this.bundleContext = bundleContext;
        for (Bundle bundle : bundleContext.getBundles()) {
            if (bundle.getBundleContext() != null) {
                registerStaticEditorForms(bundle);
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
                registerStaticEditorForms(event.getBundle());
                break;
            case BundleEvent.STOPPED:
                unregisterStaticEditorForms(event.getBundle());
        }
    }

    public SortedSet<EditorFormFieldSet> getForm(String nodeTypeName) {
        return staticEditorFormsByNodeType.get(nodeTypeName);
    }

    private void registerStaticEditorForms(Bundle bundle) {
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
            EditorFormFieldSet editorFormFieldSet;
            try {
                editorFormFieldSet = objectMapper.readValue(editorFormURL, EditorFormFieldSet.class);
                editorFormFieldSet.setOriginBundle(bundle);
                SortedSet nodeTypeEditorForms = staticEditorFormsByNodeType.get(editorFormFieldSet.getName());
                if (nodeTypeEditorForms == null) {
                    nodeTypeEditorForms = new TreeSet();
                }
                nodeTypeEditorForms.add(editorFormFieldSet);
                staticEditorFormsByNodeType.put(editorFormFieldSet.getName(), nodeTypeEditorForms);
                bundleEditorFormFieldSets.add(editorFormFieldSet);
                logger.info("Successfully loaded static form for nodeType {} from {}", editorFormFieldSet.getName(), editorFormURL);
            } catch (IOException e) {
                logger.error("Error loading editor form from " + editorFormURL, e);
            }
        }
        staticEditorFormsByBundle.put(bundle, bundleEditorFormFieldSets);
    }

    private void unregisterStaticEditorForms(Bundle bundle) {
        List<EditorFormFieldSet> bundleEditorFormFieldSets = staticEditorFormsByBundle.remove(bundle);
        if (bundleEditorFormFieldSets == null) {
            return;
        }
        for (EditorFormFieldSet bundleEditorFormFieldSet : bundleEditorFormFieldSets) {
            SortedSet<EditorFormFieldSet> nodeTypeEditorFormFieldSets = staticEditorFormsByNodeType.get(bundleEditorFormFieldSet.getName());
            if (nodeTypeEditorFormFieldSets != null) {
                nodeTypeEditorFormFieldSets.remove(bundleEditorFormFieldSet);
                staticEditorFormsByNodeType.put(bundleEditorFormFieldSet.getName(), nodeTypeEditorFormFieldSets);
            }
        }
    }

}
