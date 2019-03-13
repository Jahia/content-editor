package org.jahia.modules.contenteditor.graphql;

import org.jahia.modules.contenteditor.graphql.extensions.QueryExtensions;
import org.jahia.modules.graphql.provider.dxm.DXGraphQLExtensionsProvider;
import org.osgi.service.component.annotations.Component;

import java.util.Arrays;
import java.util.Collection;

/**
 * Main GraphQL extension provider for the content editor
 */
@Component(immediate = true, service=DXGraphQLExtensionsProvider.class)
public class DXGraphQLContentEditorProvider implements DXGraphQLExtensionsProvider {
    @Override
    public Collection<Class<?>> getExtensions() {
        return Arrays.<Class<?>>asList(QueryExtensions.class);
    }
}
