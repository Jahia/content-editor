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
package org.jahia.modules.contenteditor.render;

import org.apache.commons.lang3.StringUtils;
import org.jahia.services.render.RenderContext;
import org.jahia.services.render.Resource;
import org.jahia.services.render.filter.AbstractFilter;
import org.jahia.services.render.filter.RenderChain;
import org.jahia.services.render.filter.RenderFilter;
import org.osgi.service.component.annotations.Component;

/**
 * Render filter that will wrap the previewed node in the current render chain with a marker to be able to retrieve it easily client side.
 */
@Component(service = RenderFilter.class, immediate = true)
public class PreviewWrapperFilter extends AbstractFilter {

    private final String CE_PREVIEW_WRAPPER = "ce_preview_wrapper";
    private final String CE_PREVIEW_WRAPPER_TAG_START = "<div id=\"ce_preview_content\">";
    private final String CE_PREVIEW_WRAPPER_TAG_END = "</div>";

    public PreviewWrapperFilter() {
        setPriority(45);
        setApplyOnModes("preview");
        addCondition((renderContext, resource) -> {
            String ceAttribute = (String) renderContext.getRequest().getAttribute(CE_PREVIEW_WRAPPER);
            return StringUtils.isNotEmpty(ceAttribute) && ceAttribute.equals(resource.getNodePath());
        });
    }

    @Override
    public String execute(String previousOut, RenderContext renderContext, Resource resource, RenderChain chain) {
        return CE_PREVIEW_WRAPPER_TAG_START + previousOut + CE_PREVIEW_WRAPPER_TAG_END;
    }
}
