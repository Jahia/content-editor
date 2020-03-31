import {registry} from '@jahia/ui-extender';

/* eslint-disable-next-line no-undef, camelcase */
__webpack_public_path__ = `${window.contextJsParameters.contextPath}/modules/content-editor/javascript/apps/`;

registry.add('callback', 'content-editor', {
    targets: ['jahiaApp-init:2'],
    callback: () => Promise.all([
        import('./ContentEditor.register'),
        window.jahia.i18n.loadNamespaces('content-editor')
    ])
});
