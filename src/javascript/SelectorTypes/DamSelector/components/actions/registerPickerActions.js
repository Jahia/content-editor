import React from 'react';
import {Cancel, MoreVert} from '@jahia/moonstone';
import {unsetFieldAction} from './unsetFieldAction';
// Import {replaceAction} from './replaceAction';

export const registerDamSelectorActions = registry => {
    registry.add('action', 'content-editor/field/DamSelector', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'content-editor/field/DamSelectorActions',
        menuItemProps: {
            isShowIcons: true
        }
    });

    // Registry.add('action', 'replaceCloudinaryContent', replaceAction, {
    //     buttonIcon: <Edit/>,
    //     buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
    //     targets: ['content-editor/field/DamSelectorActions:1']
    // });

    registry.add('action', 'unsetFieldActionDamSelector', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['content-editor/field/DamSelectorActions:2']
    });
};
