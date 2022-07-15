import React from 'react';
import PropTypes from 'prop-types';
import {
    cePickerPath,
    cePickerOpenPaths,
    cePickerClosePaths,
    cePickerRemoveSelection,
    cePickerSwitchSelection,
    cePickerSetPage,
    cePickerSetPageSize,
    cePickerMode,
    cePickerAddSelection,
    cePickerSetSort,
    cePickerSetTableViewMode, cePickerSetTableViewType, cePickerClearSelection
} from '~/SelectorTypes/Picker/Picker2.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import css from './RightPanel.scss';
import {batchActions} from 'redux-batched-actions';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {Button, Typography} from '@jahia/moonstone';
import {shallowEqual, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const selector = pickerConfig => state => ({
    mode: state.contenteditor.picker.mode.replace('picker-', ''),
    siteKey: state.contenteditor.picker.site,
    path: state.contenteditor.picker.path,
    lang: state.language,
    previewSelection: null,
    previewState: 0,
    uilang: state.uilang,
    filesMode: 'grid',
    pagination: state.contenteditor.picker.pagination,
    sort: state.contenteditor.picker.sort,
    openedPaths: state.contenteditor.picker.openPaths,
    selection: state.contenteditor.picker.selection,
    tableView: state.contenteditor.picker.tableView,
    params: {typeFilter: pickerConfig.typeFilter, type: state.contenteditor.picker.mode.replace('picker-', '')}
});

const reduxActions = {
    setPathAction: path => cePickerPath(path),
    setPreviewSelectionAction: () => ({}),
    openPathsAction: paths => cePickerOpenPaths(paths),
    closePathsAction: paths => cePickerClosePaths(paths),
    removeSelectionAction: path => cePickerRemoveSelection(path),
    switchSelectionAction: path => cePickerSwitchSelection(path)
};

const ContentLayout = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentLayout})));
const ContentTable = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentTable})));
const ViewModeSelector = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ViewModeSelector})));
const ContentTypeSelector = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentTypeSelector})));

const contentTypeSelectorProps = {
    selector: state => state.contenteditor.picker.tableView,
    reduxActions: {
        setPageAction: page => cePickerSetPage(page),
        setTableViewTypeAction: view => cePickerSetTableViewType(view)
    }
};

const ContentTypeSelectorComp = props => React.createElement(ContentTypeSelector, {...props, ...contentTypeSelectorProps});

const contentTableProps = {
    ctxMenuActionKey: () => null,
    isAllowUpload: false,
    selector: state => ({
        mode: state.contenteditor.picker.mode.replace('picker-', ''),
        siteKey: state.contenteditor.picker.site,
        path: state.contenteditor.picker.path,
        previewSelection: null,
        previewState: 0,
        pagination: state.contenteditor.picker.pagination,
        selection: state.contenteditor.picker.selection,
        tableView: state.contenteditor.picker.tableView
    }),
    columnData: {
        allColumnData: allColumnData,
        reducedColumnData: allColumnData
    },
    reduxActions: {
        onPreviewSelectAction: () => ({}),
        setPathAction: (siteKey, path) => cePickerOpenPaths(getDetailedPathArray(path)),
        setModeAction: mode => cePickerMode(mode),
        setCurrentPageAction: page => cePickerSetPage(page - 1),
        setPageSizeAction: pageSize => cePickerSetPageSize(pageSize),
        removeSelectionAction: path => cePickerRemoveSelection(path)
    },
    reactTableSelectors: {
        rowSelector: state => ({selection: state.contenteditor.picker.selection}),
        sortSelector: state => state.contenteditor.picker.sort
    },
    reactTableActions: {
        rowSelection: {
            switchSelectionAction: p => batchActions([cePickerClearSelection(), cePickerAddSelection(p)]),
            removeSelectionAction: () => ({}),
            addSelectionAction: () => ({})
        },
        sort: {
            setSortAction: s => cePickerSetSort(s)
        }
    },
    ContentTypeSelector: ContentTypeSelectorComp
};

const viewModeSelectorProps = {
    selector: state => ({
        mode: state.contenteditor.picker.mode.replace('picker-', ''),
        viewMode: state.contenteditor.picker.tableView.viewMode
    }),
    setTableViewModeAction: mode => cePickerSetTableViewMode(mode)
};

const RightPanel = ({pickerConfig, onClose, onItemSelection}) => {
    const {selection} = useSelector(state => ({selection: state.contenteditor.picker.selection}), shallowEqual);
    const {t} = useTranslation('content-editor');

    return (
        <div className={css.panel}>
            <ViewModeSelector {...viewModeSelectorProps}/>
            <ContentLayout hasGWTHandlers={false}
                           refetcherKey="cePickerRightPanel"
                           selector={selector(pickerConfig)}
                           reduxActions={reduxActions}
                           ContentLayout={props => React.createElement(ContentTable, {...props, ...contentTableProps})}
            />
            <div className={css.actions}>
                <div className={css.actionCaption}>
                    <Typography variant="caption">{t('Non-selectable items are not listed in this view')}</Typography>
                </div>
                <Button
                    data-sel-picker-dialog-action="cancel"
                    size="big"
                    label={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                    onClick={onClose}
                />
                <Button
                    data-sel-picker-dialog-action="done"
                    disabled={selection.length === 0}
                    color="accent"
                    size="big"
                    label={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                    onClick={() => onItemSelection(selection[0])}
                />
            </div>
        </div>
    );
};

RightPanel.propTypes = {
    pickerConfig: configPropType.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default RightPanel;
