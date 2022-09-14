import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {FileCard, UploadTransformComponent} from '@jahia/jcontent';
import {Paper} from '@material-ui/core';
import {TablePagination} from '@jahia/moonstone';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import classNames from 'clsx';
import styles from './FilesGrid.scss';
import {
    cePickerAddSelection, cePickerClearSelection,
    cePickerMode,
    cePickerOpenPaths,
    cePickerPath,
    cePickerSetPage,
    cePickerSetPageSize
} from '~/SelectorTypes/Picker/Picker2.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import {batchActions} from 'redux-batched-actions';
import {useFieldContext} from '~/contexts/FieldContext';

const reduxActions = {
    setOpenPathAction: path => cePickerOpenPaths(getDetailedPathArray(path)),
    setPathAction: path => cePickerPath(path),
    setModeAction: mode => cePickerMode(mode),
    setCurrentPageAction: page => cePickerSetPage(page - 1),
    setPageSizeAction: pageSize => cePickerSetPageSize(pageSize),
    addToSelection: node => cePickerAddSelection(node),
    clearSelection: () => cePickerClearSelection()
};

export const FilesGrid = ({totalCount, rows, isLoading}) => {
    const {t} = useTranslation('jcontent');
    const {path, pagination, siteKey, uilang, lang, selection} = useSelector(state => ({
        path: state.contenteditor.picker.path,
        pagination: state.contenteditor.picker.pagination,
        siteKey: state.site,
        uilang: state.uilang,
        lang: state.lang,
        selection: state.contenteditor.picker.selection
    }), shallowEqual);
    const dispatch = useDispatch();
    const field = useFieldContext();
    const onPreviewSelect = previewSelection => {
        const node = rows.find(value => value.path === previewSelection);
        console.log('Selected ', previewSelection, node);
        const actions = [];
        if (!field.multiple) {
            actions.push(reduxActions.clearSelection());
        }

        actions.push(reduxActions.addToSelection(node));
        dispatch(batchActions(actions));
    };

    const setPath = (siteKey, path) => {
        const actions = [];
        actions.push(reduxActions.setOpenPathAction(path));
        actions.push(reduxActions.setPathAction(path));
        dispatch(batchActions(actions));
    };

    if ((!rows || rows.length === 0) && isLoading) {
        return null;
    }

    return (
        <>
            <div
                className={styles.grid}
                data-cm-role="grid-content-list"
                tabIndex="1"
            >
                <UploadTransformComponent uploadTargetComponent={Paper}
                                          uploadPath={path}
                                          uploadType="upload"
                                          className={classNames(styles.defaultGrid, styles.detailedGrid)}
                >
                    {rows.map((node, index) => (
                        <FileCard key={node.uuid}
                                  mode=""
                                  uilang={uilang}
                                  lang={lang}
                                  siteKey={siteKey}
                                  selection={selection}
                                  index={index}
                                  node={node}
                                  setPath={setPath}
                                  onPreviewSelect={(...args) => {
                                      onPreviewSelect(...args);
                                  }}
                        />
                    ))}
                </UploadTransformComponent>
            </div>
            <TablePagination totalNumberOfRows={totalCount}
                             currentPage={pagination.currentPage + 1}
                             rowsPerPage={pagination.pageSize}
                             label={{
                                 rowsPerPage: t('jcontent:label.pagination.rowsPerPage'),
                                 of: t('jcontent:label.pagination.of')
                             }}
                             rowsPerPageOptions={[10, 25, 50, 100]}
                             onPageChange={page => dispatch(reduxActions.setCurrentPageAction(page))}
                             onRowsPerPageChange={size => dispatch(reduxActions.setPageSizeAction(size))}
            />
        </>
    );
};

FilesGrid.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    rows: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired
};

export default FilesGrid;
