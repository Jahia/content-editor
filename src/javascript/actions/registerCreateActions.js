import React from 'react';
import {AddCircle, Save} from '@jahia/moonstone';

import {createContentAction, CreateContent} from './jcontent/createContent/createContentAction';
import {createAction} from './contenteditor/create/createAction';
import {cmGoto} from '~/redux/JContent.redux-actions';

export const registerCreateActions = registry => {
    registry.addOrReplace('action', 'createContent', createContentAction, {
        buttonIcon: <AddCircle/>,
        buttonLabel:
            'content-editor:label.contentEditor.CMMActions.createNewContent.menu',
        targets: ['createMenuActions:3', 'contentActions:3', 'headerPrimaryActions:1'],
        showOnNodeTypes: ['jnt:contentFolder', 'jnt:content'],
        hideOnNodeTypes: ['jnt:navMenuText', 'jnt:page'],
        requiredPermission: ['jcr:addChildNodes'],
        isModal: true
    });

    registry.addOrReplace('action', 'createPage', {
        buttonIcon: <AddCircle/>,
        buttonLabel:
            'content-editor:label.contentEditor.CMMActions.createNewPage.menu',
        component: props => Boolean(window.jcontentEnhanced) && <CreateContent {...props}/>,
        targets: ['createMenuActions:3', 'contentActions:3', 'headerPrimaryActions:1'],
        showOnNodeTypes: ['jnt:page', 'jnt:navMenuText'],
        requiredPermission: ['jcr:addChildNodes'],
        nodeTypes: ['jnt:page'],
        includeSubTypes: false,
        isModal: true,
        onCreate: ({path}) => {
            window.jahia.reduxStore.dispatch(cmGoto({path}));
        }
    });

    registry.addOrReplace('action', 'createNavMenuItem', {
        buttonIcon: <AddCircle/>,
        buttonLabel:
            'content-editor:label.contentEditor.CMMActions.createNewPage.menu',
        component: props => Boolean(window.jcontentEnhanced) && <CreateContent {...props}/>,
        targets: ['createMenuActions:3.1', 'contentActions:3.1'],
        showOnNodeTypes: ['jnt:page', 'jnt:navMenuText'],
        requiredPermission: ['jcr:addChildNodes'],
        nodeTypes: ['jnt:navMenuText', 'jnt:nodeLink', 'jnt:externalLink'],
        includeSubTypes: false,
        isModal: true
    });

    // In app actions
    registry.add('action', 'createButton', createAction, {
        buttonLabel: 'content-editor:label.contentEditor.create.createButton.name',
        buttonIcon: <Save/>,
        color: 'accent',
        variant: 'outlined',
        targets: ['content-editor/header/main-save-actions'],
        dataSelRole: 'createButton',
        isModal: true
    });
};
