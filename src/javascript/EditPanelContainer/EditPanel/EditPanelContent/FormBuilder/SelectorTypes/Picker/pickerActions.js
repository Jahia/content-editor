import {Edit} from '@material-ui/icons';
import {menuAction} from '@jahia/react-material';
import {DotsVertical} from 'mdi-material-ui';
import React from 'react';
import {replaceContent} from './actions/replaceContent';

const pickerActions = actionsRegistry => {
    actionsRegistry.add('ContentPickerMenu', menuAction, {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.moreOptions',
        menu: 'ContentPickerActions',
        showIcons: true
    });

    actionsRegistry.add('MediaPickerMenu', menuAction, {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.moreOptions',
        menu: 'MediaPickerActions',
        showIcons: true
    });

    // Todo finalize the replace content action
    actionsRegistry.add('replaceContent', replaceContent, {
        buttonIcon: <Edit/>,
        buttonLabel: 'Replace content',
        target: ['ContentPickerActions:1', 'MediaPickerActions:1']
    });
};

export default pickerActions;
