import React from 'react';
import {Page} from '@jahia/moonstone';
import {renderer} from './renderer';
import {Constants} from '../Picker2.constants';

const TARGET = 'page';

export const registerPageAccordionItems = registry => {
    const config = registry.get(Constants.pickerConfig, TARGET).cmp.treeConfig;

    registry.add(Constants.ACCORDION_ITEM_NAME, `${Constants.ACCORDION_ITEM_TYPES.PAGES}-${TARGET}`, renderer, {
        targets: [`${TARGET}:60`],
        icon: <Page/>,
        label: 'content-editor:label.contentEditor.picker.navigation.pages',
        defaultPath: siteKey => '/sites/' + siteKey,
        config: {
            hideRoot: true,
            rootPath: '',
            selectableTypes: config.selectableTypes,
            openableTypes: config.openableTypes,
            type: 'pages',
            key: 'browse-tree-pages'
        }
    });
};
