import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';

export const PickerEditorialLinkQueryHandler = {
    ...PickerTreeQueryHandler,

    getTreeParams: options => {
        const treeParams = PickerTreeQueryHandler.getTreeParams(options);

        if (options.tableView.viewType === Constants.tableView.type.PAGES) {
            treeParams.openableTypes = ['jnt:page'];
            treeParams.selectableTypes = ['jnt:page', 'jmix:mainResource'];
        } else { // Content
            treeParams.openableTypes = ['jnt:contentFolder'];
            treeParams.selectableTypes = ['jmix:mainResource'];
        }

        treeParams.recursionTypesFilter = {multi: 'NONE', types: ['jnt:contentFolder', 'jnt:page', 'jnt:folder']};

        return treeParams;
    }
};
