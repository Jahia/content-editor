import React from 'react';
import {registry} from '@jahia/ui-extender';
import {registerCEActions} from './registerCEActions';
import {Constants} from '~/ContentEditor.constants';
import {useI18nCENamespace} from '~/useI18n';
import ContentEditorApi from '~/Api/ContentEditor.api';
import ContentEditorRedux from './ContentEditor.redux';
import ContentPickerApi from '~/Api/ContentPicker.api';

/* eslint-disable-next-line no-undef, camelcase */
__webpack_public_path__ = `${window.contextJsParameters.contextPath}/modules/content-editor/javascript/apps/`;

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

registry.add('app', 'content-picker-api', {
    targets: ['root:16.6'],
    render: next => <><ContentPickerApi/>{next}</>
});

registry.add('callback', 'content-editor', {
    targets: ['jahiaApp-init:2'],
    callback: () => {
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
    }
});

// Register GWT Hooks
window.top.jahiaGwtHook = {
    edit: ({path, lang, siteKey, uilang}) => {
        window.CE_API.edit(path, siteKey, lang, uilang);
    }
};

console.debug('%c Content Editor is activated', 'color: #3c8cba');
