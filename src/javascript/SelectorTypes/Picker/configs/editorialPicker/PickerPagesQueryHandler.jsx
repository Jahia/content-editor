import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {PagesQueryHandler} from '@jahia/jcontent';
import {selectableTypeFragment} from '~/SelectorTypes/Picker/configs/queryHandlers';

export const PickerPagesQueryHandler = {
    ...PagesQueryHandler,

    getTreeParams: p => {
        const treeParams = PagesQueryHandler.getTreeParams(p);

        if (treeParams) {
            return ({
                ...treeParams,
                openableTypes: Constants.tableView.type.PAGES === p.tableView.viewType ? ['jnt:page'] : ['jnt:content'],
                selectableTypes: Constants.tableView.type.PAGES === p.tableView.viewType ? ['jnt:page'] : p.params.selectableTypesTable.filter(t => t !== 'jnt:page')
            });
        }
    },

    getQueryVariables: p => ({
        ...PagesQueryHandler.getQueryVariables(p),
        selectableTypesTable: p.params.selectableTypesTable,
        typeFilter: p.params.selectableTypesTable.includes('jnt:page') && Constants.tableView.type.PAGES === p.tableView.viewType ? ['jnt:page'] : p.params.selectableTypesTable.filter(t => t !== 'jnt:page')
    }),
    getFragments: () => [...PagesQueryHandler.getFragments(), selectableTypeFragment]
};
