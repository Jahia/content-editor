import React from 'react';
import {FolderSpecial} from '@jahia/moonstone';
import {renderer} from './renderer';
import {Constants} from '../Picker2.constants';

const TARGET = 'contentfolder';

export const registerContentFolderAccordionItems = registry => {
    const config = registry.get(Constants.pickerConfig, TARGET).treeConfig;
    registry.add(Constants.ACCORDION_ITEM_NAME, `${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}-${TARGET}`, renderer, {
        targets: [`${TARGET}:60`],
        icon: <FolderSpecial/>,
        label: 'content-editor:label.contentEditor.picker.navigation.contentFolders',
        defaultPath: siteKey => '/sites/' + siteKey + '/contents',
        config: {
            rootPath: '/contents',
            selectableTypes: config.selectableTypes,
            openableTypes: config.openableTypes,
            type: 'contents',
            key: 'browse-tree-content'
        }
    });
};
