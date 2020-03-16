import React from 'react';
import {registry} from '@jahia/ui-extender';
import {registerCEActions} from './registerCEActions';
import {Constants} from '~/ContentEditor.constants';
import {useI18nCENamespace} from '~/useI18n';
import ContentEditorApi from '~/Api/ContentEditor.api';
import ContentEditorRedux from './ContentEditor.redux';
import {ContentEditorHistoryContextProvider} from '~/ContentEditorHistory/ContentEditorHistory.context';

// Register i18n loadNamespaces through a empty react component until extender solve the injection issue
const DependenciesInjector = () => {
    useI18nCENamespace();
    return '';
};

registry.add('app', 'content-editor-dependencies-injector', {
    targets: ['root:0.5'],
    render: next => <><DependenciesInjector/>{next}</>
});
registry.add('app', 'content-editor-history-context', {
    targets: ['root:0.1'],
    render: next => <ContentEditorHistoryContextProvider>{next}</ContentEditorHistoryContextProvider>
});

registry.add('app', 'content-editor-api', {
    targets: ['root:16.5'],
    render: next => <><ContentEditorApi/>{next}</>
});

registerCEActions(registry);

registry.add('route', 'content-editor-edit-route', {
    targets: ['nav-root-top:2.1'],
    path: '/content-editor/:lang/edit/:uuid',
    // eslint-disable-next-line react/prop-types
    render: ({match}) => <ContentEditorRedux uuid={match.params.uuid} mode={Constants.routes.baseEditRoute} lang={match.params.lang}/>
});

registry.add('route', 'content-editor-create-route', {
    targets: ['nav-root-top:2.1'],
    path: '/content-editor/:lang/create/:parentUuid/:contentType',
    // eslint-disable-next-line react/prop-types
    render: ({match}) => <ContentEditorRedux uuid={match.params.parentUuid} mode={Constants.routes.baseCreateRoute} lang={match.params.lang} contentType={decodeURI(match.params.contentType)}/>
});

// Register GWT Hooks
window.top.jahiaGwtHook = {
    // Hook on edit engine opening
    edit: ({uuid, lang, siteKey, uilang}) => {
        window.CE_API.edit(uuid, siteKey, lang, uilang);
    },
    // Hook on create engine opening, also hook on create content type selector
    create: ({uuid, path, lang, siteKey, uilang, contentTypes, excludedNodeTypes, includeSubTypes}) => {
        window.CE_API.create(uuid, path, siteKey, lang, uilang, contentTypes, excludedNodeTypes, includeSubTypes);
    }
};

console.debug('%c Content Editor is activated', 'color: #3c8cba');
