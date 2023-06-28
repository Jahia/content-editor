import React from 'react';
import {AddCircle, Save} from '@jahia/moonstone';

import {createContentAction} from './jcontent/createContent/createContentAction';
import {createAction} from './contenteditor/create/createAction';
import {cmGoto} from '~/redux/JContent.redux-actions';
import {batchActions} from 'redux-batched-actions';
import {booleanValue} from '~/SelectorTypes/Picker/Picker.utils';

export const registerCreateActions = registry => {
    registry.addOrReplace('action', 'createContent', createContentAction, {
        defaultIcon: <AddCircle/>,
        buttonLabel:
            'content-editor:label.contentEditor.CMMActions.createNewContent.menu',
        targets: ['createMenuActions:3', 'contentActions:3', 'headerPrimaryActions:1'],
        showOnNodeTypes: ['jnt:contentFolder', 'jnt:content', 'jnt:category'],
        hideOnNodeTypes: ['jnt:navMenuText', 'jnt:page'],
        requiredPermission: ['jcr:addChildNodes'],
        hasBypassChildrenLimit: false
    });

    if (booleanValue(contextJsParameters.config.jcontent?.showPageComposer)) {
        registry.addOrReplace('action', 'createPage', createContentAction, {
            buttonIcon: <AddCircle/>,
            targets: ['createMenuActions:-2', 'contentActions:-2', 'rootContentActions:-2', 'headerPrimaryActions:1'],
            showOnNodeTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite'],
            requiredPermission: ['jcr:addChildNodes'],
            nodeTypes: ['jnt:page'],
            includeSubTypes: false,
            hasBypassChildrenLimit: true,
            onCreate: ({path}) => {
                window.jahia.reduxStore.dispatch(batchActions([{
                    type: 'CM_OPEN_PATHS', payload: [path.substring(0, path.lastIndexOf('/'))]
                }, cmGoto({path})]));
            }
        });

        registry.add('action', 'createNavMenuItemMenu', registry.get('action', 'menuAction'), {
            buttonIcon: <AddCircle/>,
            buttonLabel: 'content-editor:label.contentEditor.CMMActions.createNewContent.newMenu',
            targets: ['createMenuActions:-1', 'contentActions:-1', 'rootContentActions:-1'],
            menuTarget: 'createNavMenuItemMenu',
            isMenuPreload: true
        });

        registry.addOrReplace('action', 'createNavMenuItem', createContentAction, {
            buttonIcon: <AddCircle/>,
            targets: ['createNavMenuItemMenu'],
            showOnNodeTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite'],
            requiredPermission: ['jcr:addChildNodes'],
            nodeTypes: ['jnt:navMenuText', 'jnt:nodeLink', 'jnt:externalLink'],
            includeSubTypes: false,
            hasBypassChildrenLimit: true
        });
    }

    // In app actions
    registry.add('action', 'createButton', createAction, {
        buttonLabel: 'content-editor:label.contentEditor.create.createButton.name',
        buttonIcon: <Save/>,
        color: 'accent',
        variant: 'outlined',
        targets: ['content-editor/header/main-save-actions'],
        dataSelRole: 'createButton'
    });
};
