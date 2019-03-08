package org.jahia.modules.contenteditor.graphql;

import org.jahia.modules.contenteditor.graphql.extensions.QueryExtensions;
import org.jahia.modules.graphql.provider.dxm.DXGraphQLExtensionsProvider;

import java.util.Arrays;
import java.util.Collection;

/**
 * Main GraphQL extension provider for the content editor
 */
public class DXGraphQLContentEditorProvider implements DXGraphQLExtensionsProvider {
    @Override
    public Collection<Class<?>> getExtensions() {
        return Arrays.<Class<?>>asList(QueryExtensions.class);
    }
}
