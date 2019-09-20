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

    public PreviewWrapperFilter() {
        setPriority(45);
        setApplyOnModes("preview");
        addCondition((renderContext, resource) -> {
                String ceAttribute = (String) renderContext.getRequest().getAttribute(CE_PREVIEW_WRAPPER);
                return StringUtils.isNotEmpty(ceAttribute) && ceAttribute.equals(resource.getNodePath());
            });
    }

    @Override
    public String prepare(RenderContext renderContext, Resource resource, RenderChain chain) throws Exception {
        resource.pushWrapper(CE_PREVIEW_WRAPPER);
        return super.prepare(renderContext, resource, chain);
    }
}
