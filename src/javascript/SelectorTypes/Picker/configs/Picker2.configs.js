import {ContentPickerConfig} from './ContentPickerConfig';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {registerUserPicker} from './userPicker';
import {registerUsergroupPicker} from './usergroupPicker';
import {registerCategoryPicker} from './categoryPicker';
import {registerSitePicker} from './sitePicker';
import {registerFolderPicker} from './folderPicker';
import {registerContentFolderPicker} from './contentFolderPicker';
import {registerMediaPickers} from './mediaPicker/mediaPicker';
import {registerEditorialLinkPicker} from './editorialLinkPicker';
import {registerPagePicker} from '~/SelectorTypes/Picker/configs/pagePicker';
import {PickerSearchQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {registerEditorialPicker} from '~/SelectorTypes/Picker/configs/editorialPicker/editorialPicker';

export const registerPickerConfig = registry => {
    registry.add(Constants.pickerConfig, 'default', mergeDeep({}, ContentPickerConfig, {
        searchContentType: 'jmix:searchable',
        selectableTypesTable: ['jnt:content', 'jnt:file', 'jnt:page', 'jmix:navMenuItem'],
        showOnlyNodesWithTemplates: false
    }));

    registerPagePicker(registry);
    registerEditorialPicker(registry);
    registerEditorialLinkPicker(registry);
    registerMediaPickers(registry);
    registerFolderPicker(registry);
    registerContentFolderPicker(registry);
    registerSitePicker(registry);
    registerCategoryPicker(registry);
    registerUsergroupPicker(registry);
    registerUserPicker(registry);

    const searchItem = registry.get(Constants.ACCORDION_ITEM_NAME, 'search');
    if (searchItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-search', {
            ...searchItem,
            tableConfig: {
                queryHandler: PickerSearchQueryHandler,
                uploadType: 'import'
            }
        });
    }

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
