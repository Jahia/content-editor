import React from 'react';
import {registry} from '@jahia/ui-extender';
import {registerActions} from './registerActions';
import {Constants} from '~/ContentEditor.constants';
import {ContentEditorApi, ContentPickerApi} from './ContentEditorApi';
import {ContentEditorRoute} from './ContentEditorRoute/ContentEditorRoute';
import {ContentEditorHistoryContextProvider} from '~/contexts';
import {registerSelectorTypes} from '~/SelectorTypes';
import {pcNavigateTo} from '~/redux/pagecomposer.redux-actions';
import {registerReducer} from './registerReducer';
import {ContentEditorApiContextProvider} from '~/contexts/ContentEditorApi/ContentEditorApi.context';
import hashes from './localesHash!';

window.jahia.localeFiles = window.jahia.localeFiles || {};
window.jahia.localeFiles['content-editor'] = hashes;

export function register() {
    registry.add('app', 'content-editor-history-context', {
        targets: ['root:2.05'],
        render: next => <ContentEditorHistoryContextProvider>{next}</ContentEditorHistoryContextProvider>
    });

    registry.add('app', 'content-editor-api', {
        targets: ['root:16.5'],
        render: next => <ContentEditorApiContextProvider><ContentEditorApi/><ContentPickerApi/>{next}</ContentEditorApiContextProvider>
    });

    registerActions(registry);

    registerSelectorTypes(registry);

    registerReducer(registry);

    registry.add('content-editor-config', 'gwtedit', {
        editCallback: (updatedNode, originalNode) => {
            // Trigger Page Composer to reload iframe if system name was renamed
            if (originalNode.path !== updatedNode.path) {
                const dispatch = window.jahia.reduxStore.dispatch;
                dispatch(pcNavigateTo({oldPath: originalNode.path, newPath: updatedNode.path}));
            }
        },
        onClosedCallback: (envProps, needRefresh) => {
            if (needRefresh && window.authoringApi.refreshContent) {
                window.authoringApi.refreshContent();
            }
        }
    });

    registry.add('content-editor-config', 'gwtcreate', {
        onClosedCallback: (envProps, needRefresh) => {
            if (needRefresh && window.authoringApi.refreshContent) {
                window.authoringApi.refreshContent();
            }
        }
    });

    registry.add('content-editor-config', 'gwtcreatepage', {
        newPath: null,
        createCallback: function ({path}) {
            this.newPath = path;
        },
        onClosedCallback: function (envProps, needRefresh) {
            if (this.newPath) {
                const dispatch = window.jahia.reduxStore.dispatch;
                const currentPcPath = window.jahia.reduxStore.getState().pagecomposer.currentPage.path;
                dispatch(pcNavigateTo({oldPath: currentPcPath, newPath: encodeURIComponent(this.newPath).replaceAll('%2F', '/')}));

                // Refresh content in repository explorer to see added page
                if (window.authoringApi.refreshContent && window.location.pathname.endsWith('/jahia/repository-explorer')) {
                    window.authoringApi.refreshContent();
                }
            } else if (needRefresh && window.authoringApi.refreshContent) {
                window.authoringApi.refreshContent();
            }
        }
    });

    registry.add('route', 'content-editor-edit-route', {
        targets: ['main:2.1'],
        path: '/content-editor/:lang/edit/:uuid',
        render: ({match}) => (
            <ContentEditorRoute uuid={match.params.uuid}
                                mode={Constants.routes.baseEditRoute}
                                lang={match.params.lang}/>
        )
    });

    registry.add('route', 'content-editor-create-route', {
        targets: ['main:2.1'],
        path: '/content-editor/:lang/create/:parentUuid/:contentType?/:name?',
        render: ({match}) => (
            <ContentEditorRoute uuid={match.params.parentUuid}
                                mode={Constants.routes.baseCreateRoute}
                                lang={match.params.lang}
                                contentType={decodeURI(match.params.contentType)}
                                name={match.params.name}/>
        )
    });

    // Register GWT Hooks
    window.top.jahiaGwtHook = {
        // Hook on edit engine opening
        edit: ({uuid, lang, siteKey, uilang}) => {
            window.CE_API.edit({uuid, site: siteKey, lang, uilang, isFullscreen: false, configName: 'gwtedit'});
        },
        // Hook on create engine opening, also hook on create content type selector
        create: ({name, uuid, path, lang, siteKey, uilang, contentTypes, excludedNodeTypes, includeSubTypes}) => {
            window.CE_API.create({uuid, path, site: siteKey, lang, uilang, nodeTypes: contentTypes, excludedNodeTypes, includeSubTypes, name, isFullscreen: false, configName: contentTypes[0] === 'jnt:page' ? 'gwtcreatepage' : 'gwtcreate'});
        }
    };

    console.debug('%c Content Editor is activated', 'color: #3c8cba');
}
