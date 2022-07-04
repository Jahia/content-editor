import React from 'react';
import {Collections} from '@jahia/moonstone';
import {renderer} from './renderer';
import {Constants} from '../Picker2.constants';

const TARGET = 'file';

export const registerFileAccordionItems = registry => {
    const config = registry.get(Constants.pickerConfig, TARGET).cmp.treeConfig;

    registry.add(Constants.ACCORDION_ITEM_NAME, `${Constants.ACCORDION_ITEM_TYPES.MEDIA}-${TARGET}`, renderer, {
        targets: [`${TARGET}:70`],
        icon: <Collections/>,
        label: 'content-editor:label.contentEditor.picker.navigation.media',
        defaultPath: siteKey => '/sites/' + siteKey + '/files',
        config: {
            rootPath: '/files',
            selectableTypes: config.selectableTypes,
            openableTypes: config.openableTypes,
            type: 'files',
            key: 'browse-tree-files'
        }
    });
};
