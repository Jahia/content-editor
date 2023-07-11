import React from 'react';
import {registry} from '@jahia/ui-extender';
import {registerActions} from './registerActions';
import {ContentEditorApi, ContentPickerApi} from './ContentEditorApi';
import {registerSelectorTypes} from '~/SelectorTypes';
import {pcNavigateTo} from '~/redux/pagecomposer.redux-actions';
import {registerReducer} from './registerReducer';
import {ContentEditorApiContextProvider} from '~/contexts/ContentEditorApi/ContentEditorApi.context';
import hashes from './localesHash!';
import {ContentEditorError} from '~/ContentEditorApi/ContentEditorError';
import {ErrorBoundary} from '@jahia/jahia-ui-root';

window.jahia.localeFiles = window.jahia.localeFiles || {};
window.jahia.localeFiles['content-editor'] = hashes;

export function register() {
    registry.add('app', 'content-editor-api', {
        targets: ['root:16.5'],
        render: next => (
            <ContentEditorApiContextProvider>
                <ErrorBoundary fallback={<ContentEditorError/>}>
                    <ContentEditorApi/>
                </ErrorBoundary>
                <ContentPickerApi/>
                {next}
            </ContentEditorApiContextProvider>
        )
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
        createCallback: function ({path}, config) {
            config.newPath = path;
        },
        onClosedCallback: function (config, needRefresh) {
            if (config.newPath) {
                const dispatch = window.jahia.reduxStore.dispatch;
                const currentPcPath = window.jahia.reduxStore.getState().pagecomposer.currentPage.path;
                dispatch(pcNavigateTo({oldPath: currentPcPath, newPath: encodeURIComponent(config.newPath).replaceAll('%2F', '/')}));

                // Refresh content in repository explorer to see added page
                if (window.authoringApi.refreshContent && window.location.pathname.endsWith('/jahia/repository-explorer')) {
                    window.authoringApi.refreshContent();
                }
            } else if (needRefresh && window.authoringApi.refreshContent) {
                window.authoringApi.refreshContent();
            }
        }
    });

    // Register GWT Hooks
    window.top.jahiaGwtHook = {
        // Hook on edit engine opening
        edit: ({uuid, lang}) => {
            window.CE_API.edit({uuid, lang, isFullscreen: false, configName: 'gwtedit'});
        },
        // Hook on create engine opening, also hook on create content type selector
        create: ({name, uuid, path, lang, contentTypes, excludedNodeTypes, includeSubTypes}) => {
            window.CE_API.create({uuid, path, lang, nodeTypes: contentTypes, excludedNodeTypes, includeSubTypes, name, isFullscreen: false, configName: contentTypes[0] === 'jnt:page' ? 'gwtcreatepage' : 'gwtcreate'});
        }
    };

    console.debug('%c Content Editor is activated', 'color: #3c8cba');
}
