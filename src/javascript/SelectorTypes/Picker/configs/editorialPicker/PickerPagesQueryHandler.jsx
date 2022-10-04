import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {PagesQueryHandler} from '@jahia/jcontent';
import {selectableTypeFragment} from '~/SelectorTypes/Picker/configs/queryHandlers';

export const PickerPagesQueryHandler = {
    ...PagesQueryHandler,

    getTreeParams: options => {
        const treeParams = PagesQueryHandler.getTreeParams(options);
        const isPagesViewType = Constants.tableView.type.PAGES === options.tableView.viewType;
        const isPageTypeFn = t => t === 'jnt:page' || t === 'jmix:navMenuItem';
        let typeFilter = isPagesViewType ?
            options.selectableTypesTable.filter(isPageTypeFn) :
            options.selectableTypesTable.filter(t => !isPageTypeFn(t));

        if (treeParams) {
            return ({
                ...treeParams,
                openableTypes: isPagesViewType ? ['jnt:page'] : ['jnt:content'],
                selectableTypes: typeFilter
            });
        }
    },

    getQueryVariables: options => {
        const {selectableTypesTable, tableDisplayFilter} = options;
        const isPagesViewType = Constants.tableView.type.PAGES === options.tableView.viewType;
        const isPageTypeFn = t => t === 'jnt:page' || t === 'jmix:navMenuItem';
        let typeFilter = isPagesViewType ? selectableTypesTable.filter(isPageTypeFn) : selectableTypesTable.filter(t => !isPageTypeFn(t));

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
