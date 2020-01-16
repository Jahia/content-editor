import React from 'react';
import ReactDOM from 'react-dom';
import {registry} from '@jahia/registry';
import {registerCEActions} from './registerCEActions';

import {Constants} from '~/ContentEditor.constants';
import ContentEditor from './ContentEditor';
import {useI18nCENamespace} from '~/useI18n';

/* eslint-disable-next-line no-undef, camelcase */
__webpack_public_path__ = `${window.contextJsParameters.contextPath}/modules/content-editor/javascript/apps/`;

// Register i18n loadNamespaces through a empty react component until extender solve the injection issue
const i18nLoaderElement = document.createElement('div');
const DependenciesInjector = () => {
    useI18nCENamespace();
    return '';
};

ReactDOM.render(<DependenciesInjector/>, i18nLoaderElement);

registerCEActions();

registry.add('edit-route', {
    target: ['cmm:0.1'],
    type: 'route',
    path: `/:siteKey/:lang/${Constants.routes.baseEditRoute}`,
    render: () => <ContentEditor mode={Constants.routes.baseEditRoute}/>
});

registry.add('create-route', {
    target: ['cmm:0.1'],
    type: 'route',
    path: `/:siteKey/:lang/${Constants.routes.baseCreateRoute}`,
    render: () => <ContentEditor mode="create"/>
});

console.log('%c Content Editor is activated', 'color: #3c8cba');
