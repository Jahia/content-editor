import React from 'react';
import {FolderSpecial, Page, Tab, TabItem} from '@jahia/moonstone';
import {useDispatch, useSelector} from 'react-redux';
import classes from './EditorialLinkContentTypeSelector.scss';
import {useTranslation} from 'react-i18next';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {cePickerSetTableViewType} from '~/SelectorTypes/Picker/Picker2.redux';
import {registry} from '@jahia/ui-extender';

const localStorage = window.localStorage;

const EditorialLinkContentTypeSelector = () => {
    const {t} = useTranslation('content-editor');
    const tableView = useSelector(state => state.contenteditor.picker.tableView);
    const pickerKey = useSelector(state => state.contenteditor.picker.pickerKey);
    const dispatch = useDispatch();

    const selectableTypesTable = registry.get('pickerConfiguration', pickerKey)?.selectableTypesTable || [];

    const {CONTENT, PAGES} = Constants.tableView.type;
    const LOCAL_STORAGE_VIEW_TYPE_KEY = 'jcontent_view_type';

    const setViewType = viewType => {
        dispatch(cePickerSetTableViewType(viewType));
        localStorage.setItem(LOCAL_STORAGE_VIEW_TYPE_KEY, viewType);
    };

    const canSelectPages = selectableTypesTable.includes('jnt:page');

    return canSelectPages && (
        <Tab className={classes.tabs}>
            <TabItem isSelected={PAGES === tableView.viewType}
                     data-cm-view-type={PAGES}
                     icon={<Page/>}
                     label={t('label.contentEditor.picker.rightPanel.tabs.pages')}
                     size="big"
                     onClick={() => setViewType(PAGES)}/>
            <TabItem isSelected={CONTENT === tableView.viewType}
                     data-cm-view-type={CONTENT}
                     icon={<FolderSpecial/>}
                     label={t('label.contentEditor.picker.rightPanel.tabs.contentFolders')}
                     size="big"
                     onClick={() => setViewType(CONTENT)}/>
        </Tab>
    );
};

export {EditorialLinkContentTypeSelector};