package org.jahia.modules.contenteditor.api.forms.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.jahia.modules.contenteditor.api.forms.EditorForm;
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

@Component(immediate = true, service= StaticFormRegistry.class)
public class StaticFormRegistry implements SynchronousBundleListener {

    private static final Logger logger = LoggerFactory.getLogger(StaticFormRegistry.class);

    private Map<Bundle,List<EditorForm>> staticEditorFormsByBundle = new LinkedHashMap<>();
    private Map<String,SortedSet<EditorForm>> staticEditorFormsByNodeType = new LinkedHashMap<>();
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

    public SortedSet<EditorForm> getForm(String nodeTypeName) {
        return staticEditorFormsByNodeType.get(nodeTypeName);
    }

    private void registerStaticEditorForms(Bundle bundle) {
        if (bundle.getBundleContext() == null) {
            return;
        }
        Enumeration<URL> editorFormURLs = bundle.findEntries("META-INF/dx-content-editor-forms", "*.json", true);
        if (editorFormURLs == null) {
            return;
        }
        List<EditorForm> bundleEditorForms = new ArrayList<>();
        while (editorFormURLs.hasMoreElements()) {
            URL editorFormURL = editorFormURLs.nextElement();
            EditorForm editorForm;
            try {
                editorForm = objectMapper.readValue(editorFormURL, EditorForm.class);
                editorForm.setOriginBundle(bundle);
                SortedSet nodeTypeEditorForms = staticEditorFormsByNodeType.get(editorForm.getNodeType());
                if (nodeTypeEditorForms == null) {
                    nodeTypeEditorForms = new TreeSet();
                }
                nodeTypeEditorForms.add(editorForm);
                staticEditorFormsByNodeType.put(editorForm.getNodeType(), nodeTypeEditorForms);
                bundleEditorForms.add(editorForm);
                logger.info("Successfully loaded static form for nodeType {} from {}", editorForm.getNodeType(), editorFormURL);
            } catch (IOException e) {
                logger.error("Error loading editor form from " + editorFormURL, e);
            }
        }
        staticEditorFormsByBundle.put(bundle, bundleEditorForms);
    }

    private void unregisterStaticEditorForms(Bundle bundle) {
        List<EditorForm> bundleEditorForms = staticEditorFormsByBundle.remove(bundle);
        if (bundleEditorForms == null) {
            return;
        }
        for (EditorForm bundleEditorForm : bundleEditorForms) {
            SortedSet<EditorForm> nodeTypeEditorForms = staticEditorFormsByNodeType.get(bundleEditorForm.getNodeType());
            if (nodeTypeEditorForms != null) {
                nodeTypeEditorForms.remove(bundleEditorForm);
                staticEditorFormsByNodeType.put(bundleEditorForm.getNodeType(), nodeTypeEditorForms);
            }
        }
    }

}
