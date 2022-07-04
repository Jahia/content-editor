import React from 'react';
import {FolderSpecial, Page} from '@jahia/moonstone';
import {renderer} from './renderer';
import {Constants} from '../Picker2.constants';

const TARGET = 'editorial';

export const registerEditorialAccordionItems = registry => {
    const config = registry.get(Constants.pickerConfig, TARGET).cmp.treeConfig;

    registry.add(Constants.ACCORDION_ITEM_NAME, `${Constants.ACCORDION_ITEM_TYPES.PAGES}-${TARGET}`, renderer, {
        targets: [`${TARGET}:50`],
        icon: <Page/>,
        label: 'content-editor:label.contentEditor.picker.navigation.pages',
        defaultPath: siteKey => '/sites/' + siteKey,
        config: {
            hideRoot: true,
            rootPath: '',
            selectableTypes: ['jnt:page', 'jnt:virtualsite'],
            openableTypes: ['jnt:page', 'jnt:virtualsite', 'jnt:navMenuText'],
            type: 'pages',
            key: 'browse-tree-pages'
        }
    });

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
