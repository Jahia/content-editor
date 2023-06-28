import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';

export const PickerEditorialLinkQueryHandler = {
    ...PickerTreeQueryHandler,

    getTreeParams: options => {
        const treeParams = PickerTreeQueryHandler.getTreeParams(options);

        if (options.tableView.viewType === Constants.tableView.type.PAGES) {
            treeParams.openableTypes = ['jmix:mainResource', 'jnt:page', 'jnt:navMenuText'];
            treeParams.selectableTypes = ['jnt:page', 'jmix:mainResource'];
        } else { // Content
            treeParams.openableTypes = ['jmix:mainResource', 'jnt:contentFolder'];
            treeParams.selectableTypes = ['jmix:mainResource'];
        }

        treeParams.recursionTypesFilter = {
            multi: 'NONE',
            types: [
                'jmix:mainResource',
                'jnt:contentFolder',
                'jnt:page',
                'jnt:folder',
                'jnt:navMenuText',
                'jnt:usersFolder',
                'jnt:groupsFolder'
            ]
        };

        return treeParams;
    }
};
