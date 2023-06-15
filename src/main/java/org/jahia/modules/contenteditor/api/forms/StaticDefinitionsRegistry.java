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
package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang.StringUtils;
import org.jahia.modules.contenteditor.api.forms.model.Form;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
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

    private final Map<Bundle, List<Form>> staticEditorFormDefinitionsByBundle = new LinkedHashMap<>();
    private final Map<String, SortedSet<Form>> staticEditorFormDefinitionsByName = new LinkedHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private BundleContext bundleContext;

    @Activate
    public void activate(BundleContext bundleContext, Map<String, Object> properties) {
        this.bundleContext = bundleContext;
        for (Bundle bundle : bundleContext.getBundles()) {
            if (bundle.getBundleContext() != null) {
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
                registerStaticEditorFormDefinitions(event.getBundle());
                break;
            case BundleEvent.STOPPED:
                unregisterStaticEditorFormDefinitions(event.getBundle());
        }
    }

    SortedSet<Form> getFormDefinitions(String name) {
        return staticEditorFormDefinitionsByName.get(name);
    }

    /**
     * Retrieve all forms definition for the given type.
     *
     * @param type to look at
     * @return form definitions that match the type
     */
    SortedSet<Form> getFormDefinitionsForType(ExtendedNodeType type) {
        SortedSet<Form> forms = new TreeSet<>();
        staticEditorFormDefinitionsByName.forEach((nodeType, definitions) -> {
            if (type.isNodeType(nodeType)) {
                forms.addAll(definitions);
            }
        });
        return forms;
    }

    private void registerStaticEditorFormDefinitions(Bundle bundle) {
        if (bundle.getBundleContext() == null) {
            return;
        }
        Enumeration<URL> editorFormURLs = bundle.findEntries("META-INF/jahia-content-editor-forms/forms", "*.json", true);
        if (editorFormURLs == null) {
            return;
        }
        List<Form> bundleForms = new ArrayList<>();
        while (editorFormURLs.hasMoreElements()) {
            URL editorFormURL = editorFormURLs.nextElement();
            Form form = readEditorFormDefinition(editorFormURL, bundle);

            if (form != null) {
                bundleForms.add(form);
            }

        }
        staticEditorFormDefinitionsByBundle.put(bundle, bundleForms);
    }

    private Form readEditorFormDefinition(URL editorFormURL, Bundle bundle) {
        Form form = null;
        try {
            form = objectMapper.readValue(editorFormURL, Form.class);
            form.setOriginBundle(bundle);

            String name = form.getNodeType();

            if (StringUtils.isNotBlank(name)) {
                SortedSet<Form> forms = staticEditorFormDefinitionsByName.get(name);
                if (forms == null) {
                    forms = new TreeSet<>();
                }
                forms.add(form);
                staticEditorFormDefinitionsByName.put(name, forms);
                logger.info("Successfully loaded static form for name {} from {}", name, editorFormURL);
            } else {
                logger.error("Could not serialize the object with the {} from {}", Form.class, editorFormURL);
            }
        } catch (IOException e) {
            logger.error("Error loading editor form from " + editorFormURL, e);
        }
        return form;
    }

    private void unregisterStaticEditorFormDefinitions(Bundle bundle) {
        List<Form> bundleForms = staticEditorFormDefinitionsByBundle.remove(bundle);
        if (bundleForms == null) {
            return;
        }
        for (Form bundleForm : bundleForms) {
            SortedSet<Form> forms = staticEditorFormDefinitionsByName.get(bundleForm.getNodeType());
            if (forms != null) {
                forms.remove(bundleForm);
                staticEditorFormDefinitionsByName.put(bundleForm.getNodeType(), forms);
            }
        }
    }

}
