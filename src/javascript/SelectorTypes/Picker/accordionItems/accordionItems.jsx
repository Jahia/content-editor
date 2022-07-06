import React from 'react';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {renderer} from '~/SelectorTypes/Picker/accordionItems/renderer';
import {Collections} from '@jahia/moonstone';
import {registry} from '@jahia/ui-extender';

export const getItemTarget = pickerType => {
    return registry.get(Constants.pickerConfig, pickerType) ? pickerType : 'default';
};

export const registerAccordionItems = registry => {
    // These are jcontent accordion items, additional targets are added to enhance selection
    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    const contentFoldersItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS);
    const mediaItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.MEDIA);

    if (pagesItem) {
        registry.add(
            Constants.ACCORDION_ITEM_NAME,
            `picker-${Constants.ACCORDION_ITEM_TYPES.PAGES}`,
            {...pagesItem, targets: ['default:50', 'editorial:50', 'editoriallink:50', 'pages:50']},
            renderer
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for pages');
    }

    if (contentFoldersItem) {
        registry.add(
            Constants.ACCORDION_ITEM_NAME,
            `picker-${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}`,
            {...contentFoldersItem, targets: ['default:60', 'editorial:60', 'editoriallink:60', 'contentfolder:60']},
            renderer
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for content-folders');
    }

    if (mediaItem) {
        registry.add(
            Constants.ACCORDION_ITEM_NAME,
            `picker-${Constants.ACCORDION_ITEM_TYPES.MEDIA}`,
            {...mediaItem, targets: ['default:70', 'image:70', 'file:70', 'folder:70']},
            renderer
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for media');
    }

    // Custom category item
    registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.CATEGORY}`, renderer, {
        targets: ['category:50'],
        icon: <Collections/>,
        label: 'content-editor:label.contentEditor.picker.navigation.categories',
        defaultPath: () => '/sites/systemsite/categories',
        config: {
            rootPath: '/categories',
            selectableTypes: ['jnt:category'],
            openableTypes: ['jnt:category'],
            type: 'categories',
            key: 'browse-tree-files'
        }
    });
};
