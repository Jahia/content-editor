import React from 'react';
import {Collections, FolderSpecial, Page} from '@jahia/moonstone';
import {renderer} from './renderer';
import {Constants} from '../Picker2.constants';

const TARGET = 'default';

export const registerDefaultAccordionItems = registry => {
    const config = registry.get(Constants.pickerConfig, 'editorial').cmp.treeConfig;

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
