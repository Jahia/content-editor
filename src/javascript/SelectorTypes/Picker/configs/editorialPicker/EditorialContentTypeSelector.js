import {useSelector} from 'react-redux';
import {registry} from '@jahia/ui-extender';
import {cePickerSetPage, cePickerSetTableViewType} from '~/SelectorTypes/Picker/Picker2.redux';
import React from 'react';
import {ContentTypeSelector as JContentTypeSelector} from '@jahia/jcontent';

export const EditorialContentTypeSelector = () => {
    const pickerKey = useSelector(state => state.contenteditor.picker.pickerKey);
    const selectableTypesTable = registry.get('pickerConfiguration', pickerKey)?.selectableTypesTable || [];

    const selector = state => {
        return ({
            mode: state.contenteditor.picker.mode,
            siteKey: state.site,
            path: state.contenteditor.picker.path,
            lang: state.language,
            uilang: state.uilang,
            selectableTypesTable: selectableTypesTable,
            pagination: state.contenteditor.picker.pagination,
            sort: state.contenteditor.picker.sort,
            tableView: state.contenteditor.picker.tableView
        });
    };

    const reduxActions = {
        setPageAction: page => cePickerSetPage(page),
        setTableViewTypeAction: view => cePickerSetTableViewType(view)
    };

    const canSelectPages = selectableTypesTable.includes('jnt:page');

    return canSelectPages && <JContentTypeSelector selector={selector} reduxActions={reduxActions}/>;
};

