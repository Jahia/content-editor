import React, {useEffect, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Table, TableBody, TablePagination, TableRow} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {
    useExpanded,
    useRowMultipleSelection,
    useRowSelection,
    useSort
} from '~/SelectorTypes/Picker/reactTable/plugins';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {
    cePickerMode,
    cePickerOpenPaths,
    cePickerPath,
    cePickerSetPage,
    cePickerSetPageSize
} from '~/SelectorTypes/Picker/Picker2.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import {batchActions} from 'redux-batched-actions';
import {
    ContentEmptyDropZone,
    ContentListHeader,
    ContentNotFound,
    ContentTableWrapper,
    EmptyTable,
    UploadTransformComponent
} from '@jahia/jcontent';
import classes from './ContentTable.scss';
import {registry} from '@jahia/ui-extender';
import {useFieldContext} from '~/contexts/FieldContext';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {flattenTree} from '~/SelectorTypes/Picker/Picker2.utils';

const reduxActions = {
    onPreviewSelectAction: () => ({}),
    setOpenPathAction: path => cePickerOpenPaths(getDetailedPathArray(path)),
    setPathAction: path => cePickerPath(path),
    setModeAction: mode => cePickerMode(mode),
    setCurrentPageAction: page => cePickerSetPage(page - 1),
    setPageSizeAction: pageSize => cePickerSetPageSize(pageSize)
};

const clickHandler = {
    handleEvent(e, fcn) {
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent.detail === 1 && !this.timeout) {
            this.timeout = setTimeout(() => {
                this.timeout = undefined;
                fcn();
            }, 300);
        } else if (e.nativeEvent.detail === 2) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }
};

const SELECTION_COLUMN_ID = 'selection';

export const ContentTable = ({rows, isContentNotFound, totalCount, isLoading, pickerConfig, isStructured}) => {
    const {t} = useTranslation();
    const field = useFieldContext();
    const dispatch = useDispatch();

    const {mode, path, pagination, searchTerm, selection} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        pagination: state.contenteditor.picker.pagination,
        searchTerm: state.contenteditor.picker.searchTerms,
        selection: state.contenteditor.picker.selection
    }), shallowEqual);

    const allowDoubleClickNavigation = nodeType => {
        return !isStructured && Constants.mode.SEARCH !== mode && (['jnt:folder', 'jnt:contentFolder'].indexOf(nodeType) !== -1);
    };

    const columns = useMemo(() => {
        const flattenRows = isStructured ? flattenTree(rows) : rows;
        if (pickerConfig?.pickerTable?.columns) {
            const columns = pickerConfig.pickerTable.columns.map(c => (typeof c === 'string') ? allColumnData.find(col => col.id === c) : c);
            if (field.multiple && flattenRows.some(r => r.isSelectable) && !columns.find(c => c.id === 'selection')) {
                columns.splice((columns[0].id === 'publicationStatus') ? 1 : 0, 0, allColumnData[1]);
            }

            return columns;
        }

        return allColumnData
            // Do not include type column if media mode
            .filter(c => Constants.mode.MEDIA !== mode || c.id !== 'type')
            // Do not include selection if multiple selection is not enabled or if there are no selectable types
            .filter(c => (field.multiple && flattenRows.some(r => r.isSelectable)) || c.id !== SELECTION_COLUMN_ID);
    }, [mode, field.multiple, pickerConfig, rows, isStructured]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: tableRows,
        prepareRow,
        toggleRowExpanded,
        expandSelection
    } = useTable(
        {
            columns: columns,
            data: rows
        },
        field.multiple ? useRowMultipleSelection : useRowSelection,
        useSort,
        useExpanded
    );

    const mainPanelRef = useRef(null);
    useEffect(() => {
        if (mainPanelRef.current) {
            mainPanelRef.current.scroll(0, 0);
        }
    }, [pagination.currentPage]);

    const firstLoad = useRef(true);
    useEffect(() => {
        if (isStructured && firstLoad.current) {
            firstLoad.current = rows.length === 0;
            rows.forEach((r, i) => {
                toggleRowExpanded(i, true);
            });
        }
    }, [rows, isStructured, toggleRowExpanded, firstLoad]);

    // Expand structured view selections when root row is changed
    const rootRowUuid = useRef();
    useEffect(() => {
        if (isStructured && rootRowUuid.current !== rows[0]?.uuid && selection && selection.length) {
            rootRowUuid.current = rows[0].uuid;
            expandSelection(selection);
        }
    }, [isStructured, selection, expandSelection, rootRowUuid, rows]);

    const doubleClickNavigation = node => {
        const actions = [];

        actions.push(reduxActions.setOpenPathAction(node.path));
        actions.push(reduxActions.setPathAction(node.path));
        dispatch(batchActions(actions));
    };

    if (isContentNotFound) {
        return <ContentNotFound columnSpan={allColumnData.length} t={t}/>;
    }

    const tableHeader = registry.get('accordionItem', mode)?.tableHeader;

    if (_.isEmpty(rows) && !isLoading) {
        if ((mode === Constants.mode.SEARCH)) {
            return <EmptyTable text={searchTerm}/>;
        }

        return (
            <>
                {tableHeader}
                <ContentEmptyDropZone mode={mode} path={path}/>
            </>
        );
    }

    const handleOnClick = (e, row) => {
        if (field.multiple) {
            return; // Use selection column instead of row click for multiple selection
        }

        const selectionProps = row.getToggleRowSelectedProps();
        if (allowDoubleClickNavigation(row.original.primaryNodeType.name)) {
            clickHandler.handleEvent(e, selectionProps.onChange);
        } else {
            selectionProps.onChange();
        }
    };

    return (
        <>
            {tableHeader}
            <UploadTransformComponent uploadTargetComponent={ContentTableWrapper}
                                      reference={mainPanelRef}
                                      uploadPath={path}
                                      mode={mode}
            >
                <Table aria-labelledby="tableTitle"
                       data-cm-role="table-content-list"
                       style={{width: '100%', minWidth: '1100px'}}
                       {...getTableProps()}
                >
                    <ContentListHeader headerGroups={headerGroups}/>
                    <TableBody {...getTableBodyProps()}>
                        {tableRows.map(row => {
                            prepareRow(row);
                            const rowProps = row.getRowProps();
                            const selectionProps = row.getToggleRowSelectedProps();
                            const node = row.original;
                            const className = node.isSelectable ? classes.selectableRow : classes.doubleClickableRow;

                            return (
                                <TableRow key={'row' + row.id}
                                          {...rowProps}
                                          data-cm-role="table-content-list-row"
                                          data-sel-name={node.name}
                                          className={!selectionProps.checked && className}
                                          isHighlighted={selectionProps.checked && !field.multiple}
                                          onClick={e => handleOnClick(e, row)}
                                          onDoubleClick={() => allowDoubleClickNavigation(node.primaryNodeType.name) && doubleClickNavigation(node)}
                                >
                                    {row.cells.map(cell => <React.Fragment key={cell.column.id}>{cell.render('Cell')}</React.Fragment>)}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </UploadTransformComponent>
            {!isStructured &&
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
            />}
        </>
    );
};

ContentTable.propTypes = {
    isContentNotFound: PropTypes.bool,
    isLoading: PropTypes.bool,
    isStructured: PropTypes.bool,
    rows: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    pickerConfig: configPropType.isRequired
};

export default ContentTable;
