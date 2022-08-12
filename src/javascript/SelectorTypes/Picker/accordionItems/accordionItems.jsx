import React from 'react';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {renderer} from '~/SelectorTypes/Picker/accordionItems/renderer';
import {Collections} from '@jahia/moonstone';
import {registry} from '@jahia/ui-extender';
import {ContentTypeSelector, ViewModeSelector} from '@jahia/jcontent';
import {
    cePickerSetPage,
    cePickerSetTableViewMode,
    cePickerSetTableViewType
} from '~/SelectorTypes/Picker/Picker2.redux';
import gql from 'graphql-tag';

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
            selectableTypesTable: registry.get('pickerConfiguration', state.contenteditor.picker.pickerKey).selectableTypesTable
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

const selectableTypeFragment = {
    gql: gql`fragment IsSelectable on JCRNode {
        isSelectable: isNodeType(type: {types: $selectableTypesTable})
    }`,
    variables: {
        selectableTypesTable: '[String!]!'
    },
    applyFor: 'node'
};

function getFragments() {
    return [selectableTypeFragment];
}

function transformQueryHandler(queryHandler) {
    return {
        ...queryHandler,
        getQueryParams: p => ({
            ...queryHandler.getQueryParams(p),
            selectableTypesTable: p.params.selectableTypesTable,
            typeFilter: Array.from(new Set([...p.params.selectableTypesTable, 'jnt:contentFolder', 'jnt:folder']))
        }),
        getFragments
    };
}

function transformPagesQueryHandler(queryHandler) {
    return {
        ...queryHandler,
        getQueryParams: p => ({
            ...queryHandler.getQueryParams(p),
            selectableTypesTable: p.params.selectableTypesTable,
            typeFilter: Constants.tableView.type.PAGES === p.viewType ? ['jnt:page'] : p.params.selectableTypesTable.filter(t => t !== 'jnt:page')
        }),
        getFragments
    };
}

export const registerAccordionItems = registry => {
    // These are jcontent accordion items, additional targets are added to enhance selection
    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    const contentFoldersItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS);
    const mediaItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.MEDIA);
    const searchItem = registry.get(Constants.ACCORDION_ITEM_NAME, 'search');

    if (pagesItem) {
        registry.add(
            Constants.ACCORDION_ITEM_NAME,
            `picker-${Constants.ACCORDION_ITEM_TYPES.PAGES}`,
            {
                ...pagesItem,
                viewSelector: <ViewModeSelector {...viewModeSelectorProps}/>,
                tableHeader: <ContentTypeSelector {...contentTypeSelectorProps}/>,
                targets: ['default:50', 'editorial:50', 'editoriallink:50', 'pages:50'],
                getSearchContextData: (currentSite, node, t) => {
                    if (node) {
                        const pages = node.ancestors.filter(n => n.primaryNodeType.name === 'jnt:page');
                        if (pages.length > 0) {
                            const page = pages[0];
                            return [{
                                label: t(pagesItem.label),
                                searchPath: page.path,
                                iconStart: pagesItem.icon
                            }];
                        }
                    }

                    return [];
                },
                queryHandler: transformPagesQueryHandler(pagesItem.queryHandler)
            },
            renderer
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for pages');
    }

    if (contentFoldersItem) {
        registry.add(
            Constants.ACCORDION_ITEM_NAME,
            `picker-${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}`,
            {
                ...contentFoldersItem,
                viewSelector: <ViewModeSelector {...viewModeSelectorProps}/>,
                targets: ['default:60', 'editorial:60', 'editoriallink:60', 'contentfolder:60'],
                queryHandler: transformQueryHandler(contentFoldersItem.queryHandler)
            },
            renderer
        );

        registry.add(
            Constants.ACCORDION_ITEM_NAME,
            `picker-${Constants.ACCORDION_ITEM_TYPES.SITE}`,
            {
                ...contentFoldersItem,
                viewSelector: null,
                targets: ['site:60'],
                defaultPath: () => '/sites',
                canDisplayItem: node => /^\/sites\/.*/.test(node.path),
                queryHandler: transformQueryHandler(contentFoldersItem.queryHandler),
                config: {
                    rootPath: '',
                    selectableTypes: ['jnt:virtualsite'],
                    type: 'sites',
                    openableTypes: ['jnt:virtualsite'],
                    rootLabel: 'Sites - This is never shown',
                    key: 'browse-tree-sites'
                }
            },
            renderer
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for content-folders');
    }

    if (mediaItem) {
        registry.add(
            Constants.ACCORDION_ITEM_NAME,
            `picker-${Constants.ACCORDION_ITEM_TYPES.MEDIA}`,
            {
                ...mediaItem,
                viewSelector: false, // Todo: implement thumbnail and enable selector : <FileModeSelector {...fileModeSelectorProps}/>,
                targets: ['default:70', 'image:70', 'file:70', 'folder:70'],
                queryHandler: transformQueryHandler(mediaItem.queryHandler)
            },
            renderer
        );
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for media');
    }

    if (searchItem) {
        registry.add(
            Constants.ACCORDION_ITEM_NAME,
            'picker-search',
            {
                ...searchItem,
                queryHandler: {
                    ...searchItem.queryHandler,
                    getQueryParams: p => ({
                        ...searchItem.queryHandler.getQueryParams(p),
                        selectableTypesTable: p.params.selectableTypesTable,
                        typeFilter: Array.from(new Set([...p.params.selectableTypesTable, 'jnt:contentFolder', 'jnt:folder'])),
                        fieldFilter: {
                            filters: {
                                fieldName: 'isSelectable',
                                value: 'true'
                            }
                        }
                    }),
                    getFragments
                }
            }
        );
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
