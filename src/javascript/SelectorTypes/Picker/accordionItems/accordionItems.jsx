import React from 'react';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {renderer} from '~/SelectorTypes/Picker/accordionItems/renderer';
import {Collections} from '@jahia/moonstone';

const TARGETS = {
    default: `${Constants.ACCORDION_ITEM_TYPES.PAGES}-${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}-${Constants.ACCORDION_ITEM_TYPES.MEDIA}`,
    editorial: `${Constants.ACCORDION_ITEM_TYPES.PAGES}-${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}`,
    editoriallink: `${Constants.ACCORDION_ITEM_TYPES.PAGES}-${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}`,
    image: `${Constants.ACCORDION_ITEM_TYPES.MEDIA}`,
    file: `${Constants.ACCORDION_ITEM_TYPES.MEDIA}`,
    page: `${Constants.ACCORDION_ITEM_TYPES.PAGES}`,
    folder: `${Constants.ACCORDION_ITEM_TYPES.MEDIA}`,
    contentfolder: `${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}`,
    category: `${Constants.ACCORDION_ITEM_TYPES.CATEGORY}`
};

export const getItemTarget = pickerType => {
    const target = TARGETS[pickerType];
    return target ? target : TARGETS.default;
};

export const getAccordionItemsOverrideObject = () => ({
    [Constants.ACCORDION_ITEM_TYPES.PAGES]: {...renderer, requiredSitePermission: undefined},
    [Constants.ACCORDION_ITEM_TYPES.CATEGORY]: {...renderer, requiredSitePermission: undefined},
    [Constants.ACCORDION_ITEM_TYPES.MEDIA]: {...renderer, requiredSitePermission: undefined}
});

export const registerAccordionItems = registry => {
    // These are jcontent accordion items, additional targets are added to enhance selection
    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    const contentFoldersItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS);
    const mediaItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.MEDIA);

    if (pagesItem) {
        pagesItem.targets.push(
            {id: TARGETS.default, priority: '50'},
            {id: TARGETS.editorial, priority: '50'},
            {id: TARGETS.page, priority: '50'}
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for pages');
    }

    if (contentFoldersItem) {
        contentFoldersItem.targets.push(
            {id: TARGETS.default, priority: '60'},
            {id: TARGETS.editorial, priority: '60'},
            {id: TARGETS.contentfolder, priority: '60'}
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for content-folders');
    }

    if (mediaItem) {
        mediaItem.targets.push(
            {id: TARGETS.default, priority: '70'},
            {id: TARGETS.file, priority: '70'}
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for media');
    }

    // Custom category item
    registry.add(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.CATEGORY, renderer, {
        targets: [`${TARGETS.category}:50`],
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
