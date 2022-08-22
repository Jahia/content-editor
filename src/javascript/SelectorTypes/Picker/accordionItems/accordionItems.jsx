import React from 'react';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {renderer} from '~/SelectorTypes/Picker/accordionItems/renderer';
import {Collections, FolderUser, SiteWeb} from '@jahia/moonstone';
import {registry} from '@jahia/ui-extender';
import {ViewModeSelector} from '@jahia/jcontent';
import {EditorialLinkContentTypeSelector, JContentTypeSelector} from './ContentTypeSelector';
import {
    cePickerSetPage,
    cePickerSetTableViewMode,
    cePickerSetTableViewType
} from '~/SelectorTypes/Picker/Picker2.redux';
import {
    PickerContentsFolderQueryHandler,
    PickerBaseQueryHandler,
    PickerFilesQueryHandler,
    PickerPagesQueryHandler,
    PickerSearchQueryHandler,
    PickerTreeQueryHandler,
    PickerUserQueryHandler
} from '~/SelectorTypes/Picker/accordionItems/QueryHandlers/queryHandlers';
import {PickerEditorialLinkQueryHandler} from './QueryHandlers/PickerEditorialLinkQueryHandler';
import {getBaseSearchContextData} from '~/SelectorTypes/Picker/Picker2.utils';

// Todo: see with Fran�ois if it's possible to get rid of this and have every picker always come with a key
export const getItemTarget = pickerType => {
    return registry.get(Constants.pickerConfig, pickerType) ? pickerType : 'default';
};

const viewModeSelectorProps = {
    selector: state => ({
        mode: state.contenteditor.picker.mode,
        viewMode: state.contenteditor.picker.tableView.viewMode
    }),
    setTableViewModeAction: mode => cePickerSetTableViewMode(mode)
};

// Todo: implement selector / action
// const fileModeSelectorProps = {
//     selector: () => ({
//         mode: null
//     }),
//     setModeAction: () => ({})
// };

const contentTypeSelectorProps = {
    selector: state => ({
        mode: state.contenteditor.picker.mode,
        siteKey: state.site,
        path: state.contenteditor.picker.path,
        lang: state.language,
        uilang: state.uilang,
        params: {
            selectableTypesTable: registry.get('pickerConfiguration', state.contenteditor.picker.pickerKey)?.selectableTypesTable || []
        },
        pagination: state.contenteditor.picker.pagination,
        sort: state.contenteditor.picker.sort,
        tableView: state.contenteditor.picker.tableView
    }),
    reduxActions: {
        setPageAction: page => cePickerSetPage(page),
        setTableViewTypeAction: view => cePickerSetTableViewType(view)
    }
};

export const registerAccordionItems = registry => {
    // These are jcontent accordion items, additional targets are added to enhance selection
    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    const contentFoldersItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS);
    const mediaItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.MEDIA);
    const searchItem = registry.get(Constants.ACCORDION_ITEM_NAME, 'search');

    if (pagesItem) {
        const getSearchContextData = p => {
            const res = getBaseSearchContextData(p);
            const {node, t} = p;
            if (node) {
                const pages = node.ancestors.filter(n => n.primaryNodeType.name === 'jnt:page');
                if (pages.length > 0) {
                    const page = pages[0];
                    res.splice(2, 0, {
                        label: t(pagesItem.label),
                        searchPath: page.path,
                        iconStart: pagesItem.icon
                    });
                } else if (node.primaryNodeType.name === 'jnt:page') {
                    res.splice(2, 1, {
                        label: t(pagesItem.label),
                        searchPath: node.path,
                        iconStart: pagesItem.icon
                    });
                }
            }

            return res;
        };

        // Page content
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.PAGES}`, {
            ...pagesItem,
            viewSelector: <ViewModeSelector {...viewModeSelectorProps}/>,
            tableHeader: <JContentTypeSelector {...contentTypeSelectorProps}/>,
            targets: ['default:50', 'editorial:50'],
            defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
            getSearchContextData,
            queryHandler: PickerPagesQueryHandler
        }, renderer);

        // Pages tree
        registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-pages-tree', {
            ...pagesItem,
            viewSelector: null,
            tableHeader: null,
            getPathForItem: null,
            targets: ['page:50'],
            defaultSort: {orderBy: ''},
            getSearchContextData,
            queryHandler: PickerTreeQueryHandler
        }, renderer);

        // Editorial link
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.EDITORIAL_LINK}`, {
            ...pagesItem,
            targets: ['editoriallink:40'],
            defaultPath: site => `/sites/${site}`,
            queryHandler: PickerEditorialLinkQueryHandler,
            tableHeader: <EditorialLinkContentTypeSelector/>,
            getPathForItem: node => node.site.path,
            getSearchContextData,
            viewSelector: null,
            config: {
                rootPath: '',
                selectableTypes: ['jnt:page', 'jmix:mainResource'],
                openableTypes: ['jnt:page', 'jnt:contentFolder']
            }
        }, renderer);
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for pages');
    }

    if (contentFoldersItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}`, {
            ...contentFoldersItem,
            viewSelector: <ViewModeSelector {...viewModeSelectorProps}/>,
            targets: ['default:60', 'editorial:60'],
            queryHandler: PickerContentsFolderQueryHandler
        }, renderer);

        registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-content-folders-tree', {
            ...contentFoldersItem,
            targets: ['contentfolder:60'],
            defaultPath: site => `/sites/${site}`,
            getPathForItem: null,
            queryHandler: PickerTreeQueryHandler
        }, renderer);
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for content-folders');
    }

    if (mediaItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.MEDIA}`, {
            ...mediaItem,
            viewSelector: false, // Todo: implement thumbnail and enable selector : <FileModeSelector {...fileModeSelectorProps}/>,
            targets: ['default:70', 'image:70', 'file:70'],
            defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
            queryHandler: PickerFilesQueryHandler
        }, renderer);

        registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-media-tree', {
            ...mediaItem,
            targets: ['folder:70'],
            defaultPath: site => `/sites/${site}`,
            getPathForItem: null,
            defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
            queryHandler: PickerTreeQueryHandler
        }, renderer);
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for media');
    }

    if (searchItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-search', {
            ...searchItem,
            queryHandler: PickerSearchQueryHandler
        });
    }

    registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.SITE}`, {
        targets: ['site:60'],
        icon: <SiteWeb/>,
        label: 'content-editor:label.contentEditor.edit.fields.contentPicker.sitesRootLabel',
        defaultPath: () => '/sites',
        canDisplayItem: ({selectionNode, folderNode}) => selectionNode ? /^\/sites\/.*/.test(selectionNode.path) : /^\/sites((\/.*)|$)/.test(folderNode.path),
        defaultSort: {orderBy: 'displayName', order: 'ASC'},
        queryHandler: PickerBaseQueryHandler,
        config: {
            rootPath: '',
            selectableTypes: ['jnt:virtualsite'],
            openableTypes: ['jnt:virtualsite'],
            rootLabel: 'Sites - This is never shown'
        }
    }, renderer);

    // Custom category item
    registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.CATEGORY}`, {
        targets: ['category:50'],
        icon: <Collections/>,
        label: 'content-editor:label.contentEditor.picker.navigation.categories',
        defaultPath: () => '/sites/systemsite/categories',
        canDisplayItem: ({selectedNode, folderNode}) => selectedNode ? /^\/sites\/systemsite\/categories\/.*/.test(selectedNode.path) : /^\/sites\/systemsite\/categories((\/.*)|$)/.test(folderNode.path),
        defaultSort: {orderBy: 'displayName', order: 'ASC'},
        queryHandler: PickerTreeQueryHandler,
        config: {
            rootPath: '/categories',
            selectableTypes: ['jnt:category'],
            openableTypes: ['jnt:category']
        }
    }, renderer);

    // Custom category item
    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-user', {
        targets: ['user:50'],
        icon: <FolderUser/>,
        label: 'content-editor:label.contentEditor.picker.navigation.users',
        defaultPath: () => '/',
        canDisplayItem: node => /^\/sites\/[^/]+\/users\/.*/.test(node.path),
        getSearchContextData: ({currentSite, t}) => {
            return [
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.search'),
                    searchPath: '',
                    isDisabled: true
                },
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.allUsers'),
                    searchPath: '/',
                    iconStart: <FolderUser/>
                },
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.globalUsers'),
                    searchPath: '/users',
                    iconStart: <FolderUser/>
                },
                ...(currentSite ? [{
                    label: currentSite.substring(0, 1).toUpperCase() + currentSite.substring(1),
                    searchPath: `/sites/${currentSite}/users`,
                    iconStart: <FolderUser/>
                }] : [])
            ];
        },
        defaultSort: {orderBy: 'displayName', order: 'ASC'},
        queryHandler: PickerUserQueryHandler,
        config: {
            rootPath: '',
            selectableTypes: ['jnt:user'],
            openableTypes: ['jnt:user']
        }
    }, renderer);

    setTimeout(() => {
        const openInJContent = registry.get('action', 'openInJContent');
        if (openInJContent) {
            openInJContent.targets.push({id: 'content-editor/pickers/picker-media/header-actions', priority: 0});
            openInJContent.targets.push({id: 'content-editor/pickers/picker-content-folders/header-actions', priority: 0});
        }

        const openInPageComposer = registry.get('action', 'pageComposer');
        if (openInPageComposer) {
            openInPageComposer.targets.push({id: 'content-editor/pickers/picker-pages/header-actions', priority: 0});
        }
    });
};
