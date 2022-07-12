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
    cePickerSetTableViewMode
} from '~/SelectorTypes/Picker/Picker2.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import css from './RightPanel.scss';

const selector = state => ({
    mode: state.contenteditor.picker.mode.replace('picker-', ''),
    siteKey: state.contenteditor.picker.site,
    path: state.contenteditor.picker.path,
    lang: state.language,
    previewSelection: null,
    previewState: 0,
    uilang: state.uilang,
    // Todo figure this out proper
    params: state => ({type: state.contenteditor.picker.mode.replace('picker-', '')}),
    filesMode: 'grid',
    pagination: state.contenteditor.picker.pagination,
    sort: state.contenteditor.picker.sort,
    openedPaths: state.contenteditor.picker.openPaths,
    selection: state.contenteditor.picker.selection,
    tableView: state.contenteditor.picker.tableView
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

const contentTableProps = {
    doubleClickNavigation: () => console.log('double clicking'),
    ctxMenuActionKey: () => null,
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
            switchSelectionAction: p => cePickerSwitchSelection(p),
            removeSelectionAction: p => cePickerRemoveSelection(p),
            addSelectionAction: p => cePickerAddSelection(p)
        },
        sort: {
            setSortAction: s => cePickerSetSort(s)
        }
    }
}

const viewModeSelectorProps = {
    selector: state => ({
        mode: state.contenteditor.picker.mode.replace('picker-', ''),
        viewMode: state.contenteditor.picker.tableView.viewMode
    }),
    setTableViewModeAction: mode => cePickerSetTableViewMode(mode)
}

const RightPanel = () => {

    return (
        <div className={css.panel}>
            <ViewModeSelector {...viewModeSelectorProps} />
            <ContentLayout hasGWTHandlers={false}
                           refetcherKey="cePickerRightPanel"
                           selector={selector}
                           reduxActions={reduxActions}
                           ContentLayout={props => React.createElement(ContentTable, {...props, ...contentTableProps})}
            />
        </div>
    )
};

export default RightPanel;
