import React from 'react';
import {registry} from '@jahia/ui-extender';
import {registerCEActions} from './registerCEActions';
import {Constants} from '~/ContentEditor.constants';
import {ContentEditorApi} from '~/Api/ContentEditorApi';
import ContentEditorRedux from './ContentEditor.redux';
import {ContentEditorHistoryContextProvider} from '~/ContentEditorHistory/ContentEditorHistory.context';
import {registerSelectorTypes} from '~/SelectorTypes';
import {pcNavigateTo} from '~/pagecomposer.redux-actions';
import {registerReducer} from './redux/registerReducer';

export default function () {
    registry.add('app', 'content-editor-history-context', {
        targets: ['root:2.05'],
        render: next => <ContentEditorHistoryContextProvider>{next}</ContentEditorHistoryContextProvider>
    });

    registry.add('app', 'content-editor-api', {
        targets: ['root:16.5'],
        render: next => <><ContentEditorApi/>{next}</>
    });

    registerCEActions(registry);

    registerSelectorTypes(registry);

    registerReducer(registry);

    registry.add('route', 'content-editor-edit-route', {
        targets: ['main:2.1'],
        path: '/content-editor/:lang/edit/:uuid',
        // eslint-disable-next-line react/prop-types
        render: ({match}) => (
            <ContentEditorRedux uuid={match.params.uuid}
                                mode={Constants.routes.baseEditRoute}
                                lang={match.params.lang}/>
        )
    });

    registry.add('route', 'content-editor-create-route', {
        targets: ['main:2.1'],
        path: '/content-editor/:lang/create/:parentUuid/:contentType?/:name?',
        // eslint-disable-next-line react/prop-types
        render: ({match}) => (
            <ContentEditorRedux uuid={match.params.parentUuid}
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
            window.CE_API.edit(uuid, siteKey, lang, uilang, false, (updatedNode, originalNode) => {
                // Trigger Page Composer to reload iframe if system name was renamed
                if (originalNode.path !== updatedNode.path) {
                    const dispatch = window.jahia.reduxStore.dispatch;
                    dispatch(pcNavigateTo({oldPath: originalNode.path, newPath: updatedNode.path}));
                }
            }, (envProps, needRefresh) => {
                // Restore GWT language
                if (window.authoringApi.switchLanguage) {
                    window.authoringApi.switchLanguage(lang);
                }

                if (needRefresh && window.authoringApi.refreshContent) {
                    window.authoringApi.refreshContent();
                }
            });
        },
        // Hook on create engine opening, also hook on create content type selector
        create: ({name, uuid, path, lang, siteKey, uilang, contentTypes, excludedNodeTypes, includeSubTypes}) => {
            let newPath;
            window.CE_API.create(uuid, path, siteKey, lang, uilang, contentTypes, excludedNodeTypes, includeSubTypes, name, false, ({path}) => {
                newPath = path;
            }, (envProps, needRefresh) => {
                // Restore GWT language
                if (window.authoringApi.switchLanguage) {
                    window.authoringApi.switchLanguage(lang);
                }

                if (contentTypes[0] === 'jnt:page' && newPath) {
                    const dispatch = window.jahia.reduxStore.dispatch;
                    const currentPcPath = window.jahia.reduxStore.getState().pagecomposer.currentPage.path;
                    dispatch(pcNavigateTo({oldPath: currentPcPath, newPath}));
                } else if (needRefresh && window.authoringApi.refreshContent) {
                    window.authoringApi.refreshContent();
                }
            });
        }
    };

    console.debug('%c Content Editor is activated', 'color: #3c8cba');
}
