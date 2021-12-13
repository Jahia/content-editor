import React from 'react';

import {UnsetFieldActionComponent} from '../actions/unsetField.action';
import {SelectAllActionComponent} from './MultipleSelect/actions/selectAll.action';
import {Add, Close, MoreVert} from '@jahia/moonstone';

const registerChoiceListActions = registry => {
    registry.add('action', 'content-editor/field/Choicelist', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'content-editor/field/Choicelist',
        menuItemProps: {
            isShowIcons: true
        }
    });

    registry.add('action', 'unsetFieldActionChoiceList', {
        component: UnsetFieldActionComponent,
        buttonIcon: <Close/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['content-editor/field/Choicelist:1']
    });

    registry.add('action', 'selectAllActionChoiceList', {
        component: SelectAllActionComponent,
        buttonIcon: <Add/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.selectAll',
        targets: ['content-editor/field/Choicelist:2']
    });
};

export default registerChoiceListActions;
