import React from 'react';

import {unsetFieldAction} from '~/SelectorTypes/actions/unsetFieldAction';
import {Add, Close, MoreVert} from '@jahia/moonstone';
import {selectAllAction} from './selectAllAction';

export const registerChoiceListActions = registry => {
    registry.add('action', 'content-editor/field/Choicelist', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'content-editor/field/Choicelist',
        menuItemProps: {
            isShowIcons: true
        }
    });

    registry.add('action', 'unsetFieldActionChoiceList', unsetFieldAction, {
        buttonIcon: <Close/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['content-editor/field/Choicelist:1']
    });

    registry.add('action', 'selectAllActionChoiceList', selectAllAction, {
        buttonIcon: <Add/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.selectAll',
        targets: ['content-editor/field/Choicelist:2']
    });
};
