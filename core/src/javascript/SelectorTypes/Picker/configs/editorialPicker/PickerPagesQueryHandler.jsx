import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {PagesQueryHandler, BaseTreeQueryHandler} from '@jahia/jcontent';
import {selectableTypeFragment} from '~/SelectorTypes/Picker/configs/queryHandlers';

const isPageTypeFn = t => t === 'jnt:page' || t === 'jmix:navMenuItem';

const getTypesParams = options => {
    const {selectableTypesTable, tableView} = options;
    const isPagesViewType = Constants.tableView.type.PAGES === tableView.viewType && selectableTypesTable.indexOf('jnt:page') > -1;
    let typeFilter = isPagesViewType ?
        selectableTypesTable.filter(isPageTypeFn) :
        selectableTypesTable.filter(t => !isPageTypeFn(t));
    return {isPagesViewType, typeFilter};
};

const getTreeParams = (isPagesViewType, options) => {
    const {openPaths, tableView} = options;
    if (openPaths && tableView.viewMode === 'structuredView' && !isPagesViewType) {
        return BaseTreeQueryHandler.getTreeParams(options);
    }

    return null;
};

export const PickerPagesQueryHandler = {
    ...PagesQueryHandler,

    getTreeParams: options => {
        let {isPagesViewType, typeFilter} = getTypesParams(options);
        const treeParams = getTreeParams(isPagesViewType, options);

        if (treeParams) {
            return ({
                ...treeParams,
                openableTypes: isPagesViewType ? ['jmix:navMenuItem'] : ['jnt:content'],
                selectableTypes: typeFilter
            });
        }
    },

    getQueryVariables: options => {
        const {selectableTypesTable, tableDisplayFilter} = options;
        let {typeFilter} = getTypesParams(options);

        return {
            ...PagesQueryHandler.getQueryVariables(options),
            selectableTypesTable,
            typeFilter,
            fieldFilter: {
                multi: tableDisplayFilter ? 'ANY' : 'NONE',
                filters: tableDisplayFilter || []
            }
        };
    },
    getFragments: () => [...PagesQueryHandler.getFragments(), selectableTypeFragment]
};
