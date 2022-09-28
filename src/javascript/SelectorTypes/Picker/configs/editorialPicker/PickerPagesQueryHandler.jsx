import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {PagesQueryHandler} from '@jahia/jcontent';
import {selectableTypeFragment} from '~/SelectorTypes/Picker/configs/queryHandlers';

export const PickerPagesQueryHandler = {
    ...PagesQueryHandler,

    getTreeParams: options => {
        const treeParams = PagesQueryHandler.getTreeParams(options);

        if (treeParams) {
            return ({
                ...treeParams,
                openableTypes: Constants.tableView.type.PAGES === options.tableView.viewType ? ['jnt:page'] : ['jnt:content'],
                selectableTypes: Constants.tableView.type.PAGES === options.tableView.viewType ? ['jnt:page'] : options.selectableTypesTable.filter(t => t !== 'jnt:page')
            });
        }
    },

    getQueryVariables: options => ({
        ...PagesQueryHandler.getQueryVariables(options),
        selectableTypesTable: options.selectableTypesTable,
        typeFilter: options.selectableTypesTable.includes('jnt:page') && Constants.tableView.type.PAGES === options.tableView.viewType ? ['jnt:page'] : options.selectableTypesTable.filter(t => t !== 'jnt:page'),
        fieldFilter: {
            multi: options.selectableFilter ? 'ANY' : 'NONE',
            filters: (options.selectableFilter ? options.selectableFilter : [])
        }
    }),
    getFragments: () => [...PagesQueryHandler.getFragments(), selectableTypeFragment]
};
