import React, {useEffect, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Table, TableBody, TablePagination, TableRow} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {
    useRowMultipleSelection,
    useRowSelection
} from '~/SelectorTypes/Picker/reactTable/plugins';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {
    cePickerClosePaths,
    cePickerMode,
    cePickerOpenPaths,
    cePickerPath,
    cePickerSetPage,
    cePickerSetPageSize, cePickerSetSort
} from '~/SelectorTypes/Picker/Picker2.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import {batchActions} from 'redux-batched-actions';
import {
    reactTable,
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

    const {mode, path, pagination, searchTerm, openPaths, sort} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        pagination: state.contenteditor.picker.pagination,
        searchTerm: state.contenteditor.picker.searchTerms,
        selection: state.contenteditor.picker.selection,
        openPaths: state.contenteditor.picker.openPaths,
        sort: state.contenteditor.picker.sort
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
        prepareRow
    } = useTable(
        {
            columns: columns,
            data: rows,
            isExpanded: row => openPaths.indexOf(row.path) > -1,
            onExpand: (id, value) => {
                const node = id.split('.').reduce((p, i) => p.subRows[i], {subRows: rows});
                if (value === false) {
                    dispatch(cePickerClosePaths([node.path]));
                } else {
                    dispatch(cePickerOpenPaths([node.path]));
                }
            },
            sort,
            onSort: (column, order) => {
                dispatch(cePickerSetSort({order, orderBy: column.property}));
            }
        },
        field.multiple ? useRowMultipleSelection : useRowSelection,
        reactTable.useSort,
        reactTable.useExpandedControlled
    );

    const mainPanelRef = useRef(null);
    useEffect(() => {
        if (mainPanelRef.current) {
            mainPanelRef.current.scroll(0, 0);
        }
    }, [pagination.currentPage]);

    const doubleClickNavigation = node => {
        const actions = [];

        actions.push(reduxActions.setOpenPathAction(node.path));
        actions.push(reduxActions.setPathAction(node.path));
        dispatch(batchActions(actions));
    };

    if (isContentNotFound) {
        return <ContentNotFound columnSpan={allColumnData.length} t={t}/>;
    }

    const tableConfig = registry.get('accordionItem', mode)?.tableConfig;
    const tableHeader = tableConfig?.tableHeader;

    if (!rows?.length && !isLoading) {
        if ((mode === Constants.mode.SEARCH)) {
            return <EmptyTable text={searchTerm}/>;
        }

        return (
            <>
                {tableHeader}
                <ContentEmptyDropZone uploadType={tableConfig?.uploadType} path={path}/>
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
                                      uploadType={tableConfig?.uploadType}
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
