import React, {useEffect, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {FileCard, FilesGridEmptyDropZone, jcontentUtils, useFileDrop} from '@jahia/jcontent';
import {TablePagination} from '@jahia/moonstone';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import classNames from 'clsx';
import clsx from 'clsx';
import styles from './FilesGrid.scss';
import {
    cePickerAddSelection,
    cePickerClearSelection,
    cePickerMode,
    cePickerOpenPaths,
    cePickerPath,
    cePickerRemoveSelection,
    cePickerSetPage,
    cePickerSetPageSize
} from '~/SelectorTypes/Picker/Picker.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker.utils';
import {batchActions} from 'redux-batched-actions';
import {registry} from '@jahia/ui-extender';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';

const reduxActions = {
    setOpenPathAction: path => cePickerOpenPaths(getDetailedPathArray(path)),
    setPathAction: path => cePickerPath(path),
    setModeAction: mode => cePickerMode(mode),
    setCurrentPageAction: page => cePickerSetPage(page - 1),
    setPageSizeAction: pageSize => cePickerSetPageSize(pageSize),
    addToSelection: uuid => cePickerAddSelection(uuid),
    removeFromSelection: uuid => cePickerRemoveSelection(uuid),
    clearSelection: () => cePickerClearSelection()
};

const Grid = React.forwardRef(({children, ...rest}, ref) => (
    <div ref={ref} className={classNames(styles.defaultGrid, styles.detailedGrid)} {...rest}>
        {children}
    </div>
));

Grid.propTypes = {
    children: PropTypes.node
};

export const FilesGrid = ({totalCount, rows, isLoading, pickerConfig, isMultiple, accordionItemProps, dblClickSelect}) => {
    const {t} = useTranslation('jcontent');
    const {mode, path, pagination, siteKey, uilang, lang, selection} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        pagination: state.contenteditor.picker.pagination,
        siteKey: state.site,
        uilang: state.uilang,
        lang: state.language,
        selection: state.contenteditor.picker.selection
    }), shallowEqual);
    const dispatch = useDispatch();
    const tableConfig = useMemo(() => {
        return jcontentUtils.getAccordionItem(registry.get('accordionItem', mode), accordionItemProps)?.tableConfig;
    }, [mode, accordionItemProps]);
    const onPreviewSelect = previewSelection => {
        const actions = [];
        if (!isMultiple) {
            actions.push(reduxActions.clearSelection());
        }

        if (selection.indexOf(previewSelection.uuid) === -1) {
            actions.push(reduxActions.addToSelection(previewSelection.uuid));
        } else {
            actions.push(reduxActions.removeFromSelection(previewSelection.uuid));
        }

        dispatch(batchActions(actions));
    };

    const setPath = (siteKey, path) => {
        const actions = [];
        actions.push(reduxActions.setOpenPathAction(path));
        actions.push(reduxActions.setPathAction(path));
        dispatch(batchActions(actions));
    };

    const mainPanelRef = useRef(null);
    useEffect(() => {
        if (mainPanelRef.current) {
            mainPanelRef.current.scroll(0, 0);
        }
    }, [pagination.currentPage]);

    const [{isCanDrop}, dropFile] = useFileDrop({
        uploadType: 'upload',
        uploadPath: path,
        uploadFilter: file => !tableConfig?.uploadFilter || tableConfig.uploadFilter(file, mode, pickerConfig)
    });

    dropFile(mainPanelRef);

    if ((!rows || rows.length === 0) && !isLoading) {
        return (
            <FilesGridEmptyDropZone uploadType="upload" reference={mainPanelRef} isCanDrop={isCanDrop}/>
        );
    }

    return (
        <>
            <div
                className={clsx(styles.grid, isCanDrop && styles.drop)}
                data-cm-role="grid-content-list"
                tabIndex="1"
            >
                <Grid ref={mainPanelRef}>
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
                                  contextualMenuAction="contentPickerMenu"
                                  tableConfig={tableConfig}
                                  onPreviewSelect={(...args) => {
                                      onPreviewSelect(...args);
                                  }}
                                  onDoubleClick={() => {
                                      if (['jnt:page', 'jnt:folder', 'jnt:contentFolder'].indexOf(node.primaryNodeType.name) !== -1) {
                                          setPath(siteKey, node.path, mode);
                                      } else {
                                          dblClickSelect(node.uuid);
                                      }
                                  }}
                        />
                    ))}
                </Grid>
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
    totalCount: PropTypes.number.isRequired,
    pickerConfig: configPropType.isRequired,
    isMultiple: PropTypes.bool,
    accordionItemProps: PropTypes.object,
    dblClickSelect: PropTypes.func.isRequired
};

export default FilesGrid;
