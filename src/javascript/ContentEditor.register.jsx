import React from 'react';
import {registry} from '@jahia/ui-extender';
import {registerCEActions} from './registerCEActions';
import {Constants} from '~/ContentEditor.constants';
import {useI18nCENamespace} from '~/useI18n';
import ContentEditorApi from '~/Api/ContentEditor.api';
import ContentEditorRedux from './ContentEditor.redux';

// Register i18n loadNamespaces through a empty react component until extender solve the injection issue
const DependenciesInjector = () => {
    useI18nCENamespace();
    return '';
};

registry.add('app', 'content-editor-dependencies-injector', {
    targets: ['root:0.5'],
    render: next => <><DependenciesInjector/>{next}</>
});

registry.add('app', 'content-editor-api', {
    targets: ['root:16.5'],
    render: next => <><ContentEditorApi/>{next}</>
});

registerCEActions(registry);

registry.add('route', 'edit-route', {
    targets: ['jcontent:0.1'],
    path: `/jcontent/:siteKey/:lang/${Constants.routes.baseEditRoute}`,
    render: () => <ContentEditorRedux mode={Constants.routes.baseEditRoute}/>
});

registry.add('route', 'create-route', {
    targets: ['jcontent:0.1'],
    path: `/jcontent/:siteKey/:lang/${Constants.routes.baseCreateRoute}`,
    render: () => <ContentEditorRedux mode="create"/>
});

// Register GWT Hooks
window.top.jahiaGwtHook = {
    // Hook on edit engine opening
    edit: ({path, lang, siteKey, uilang}) => {
        window.CE_API.edit(path, siteKey, lang, uilang);
    },
    // Hook on create engine opening, also hook on create content type selector
    create: ({path, lang, siteKey, uilang, contentTypes, excludedNodeTypes, includeSubTypes}) => {
        window.CE_API.create(path, siteKey, lang, uilang, contentTypes, excludedNodeTypes, includeSubTypes);
    }
};

console.debug('%c Content Editor is activated', 'color: #3c8cba');
