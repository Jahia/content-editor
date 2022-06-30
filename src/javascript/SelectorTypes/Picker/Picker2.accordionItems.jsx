import React from "react";
import {AccordionItem, Collections, Page, FolderSpecial} from '@jahia/moonstone';
import {cePickerPath, cePickerOpenPaths, cePickerClosePaths} from '~/SelectorTypes/Picker/Picker2.redux';

const ContentTree = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentTree})));

const selectorObject = {
    siteKey: state => state.contenteditor.picker.site,
    lang: state => state.language,
    path: state => state.contenteditor.picker.path,
    openPaths: state => state.contenteditor.picker.openPaths
}

const actions = {
    setPathAction: path => cePickerPath(path),
    openPathAction: path => cePickerOpenPaths([path]),
    closePathAction: path => cePickerClosePaths([path])
}

const PAGES = 'PAGES';
const CONTENT = 'CONTENT-FOLDERS';
const MEDIA = 'MEDIA';
export const ACCORDION_ITEM_NAME = 'PICKER_ACCORDION_ITEM';
export const TARGETS = {
    defaultPicker: `${PAGES}-${CONTENT}-${MEDIA}`,
    editorialPicker: `${PAGES}-${CONTENT}`,
    editorialLinkPicker: `${PAGES}-${CONTENT}`,
    imagePicker: `${MEDIA}`,
    filePicker: `${MEDIA}`,
    pagePicker: `${PAGES}`,
    folderPicker: `${MEDIA}`,
    contentFolderPicker: `${CONTENT}`
};

export const registerPickerAccordionItems = registry => {
    const renderer = {
        render: (v, item) => (
            <AccordionItem key={v.id} id={v.id} label={v.label} icon={v.icon}>
                <ContentTree refetcherType="cePickerRefetcher" item={item} selectorObject={selectorObject} {...actions}/>
            </AccordionItem>
        )
    };

    registry.add(ACCORDION_ITEM_NAME, 'pages', renderer, {
        targets: [`${TARGETS.defaultPicker}:50`, `${TARGETS.editorialPicker}:50`],
        icon: <Page/>,
        label: 'jcontent:label.contentManager.navigation.pages',
        defaultPath: siteKey => '/sites/' + siteKey,
        config: {
            hideRoot: true,
            rootPath: '',
            selectableTypes: ['jnt:page', 'jnt:virtualsite'],
            type: 'pages',
            openableTypes: ['jnt:page', 'jnt:virtualsite', 'jnt:navMenuText'],
            rootLabel: 'jcontent:label.contentManager.browsePages',
            key: 'browse-tree-pages'
        }
    });

    registry.add(ACCORDION_ITEM_NAME, 'content-folders', renderer, {
        targets: [`${TARGETS.defaultPicker}:60`, `${TARGETS.editorialPicker}:60`],
        icon: <FolderSpecial/>,
        label: 'jcontent:label.contentManager.navigation.contentFolders',
        defaultPath: siteKey => '/sites/' + siteKey + '/contents',
        config: {
            rootPath: '/contents',
            selectableTypes: ['jmix:visibleInContentTree', 'jnt:contentFolder'],
            type: 'contents',
            openableTypes: ['jmix:visibleInContentTree', 'jnt:contentFolder'],
            rootLabel: 'jcontent:label.contentManager.browseFolders',
            key: 'browse-tree-content'
        }
    });

    registry.add(ACCORDION_ITEM_NAME, 'media', renderer, {
        targets: [`${TARGETS.defaultPicker}:70`],
        icon: <Collections/>,
        label: 'jcontent:label.contentManager.navigation.media',
        defaultPath: siteKey => '/sites/' + siteKey + '/files',
        config: {
            rootPath: '/files',
            selectableTypes: ['jnt:folder'],
            type: 'files',
            openableTypes: ['jnt:folder'],
            rootLabel: 'jcontent:label.contentManager.browseFiles',
            key: 'browse-tree-files'
        }
    });
}



