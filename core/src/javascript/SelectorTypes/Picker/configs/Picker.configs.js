import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
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
    registry.add(Constants.pickerConfig, 'default', {});

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
                contextualMenu: 'contentPickerMenu'
            }
        });
    }

    setTimeout(() => {
        registry.get('action', 'openInJContent')?.targets?.push(
            {id: 'content-editor/pickers/picker-media/header-actions', priority: 1},
            {id: 'content-editor/pickers/picker-content-folders/header-actions', priority: 1}
        );

        registry.get('action', 'pageComposer')?.targets?.push({id: 'content-editor/pickers/picker-pages/header-actions', priority: 1});
        registry.get('action', 'createFolder')?.targets?.push({id: 'content-editor/pickers/picker-media/header-actions', priority: 2});
        registry.get('action', 'fileUpload')?.targets?.push({id: 'content-editor/pickers/picker-media/header-actions', priority: 3});
    });
};
