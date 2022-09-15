import React, {useEffect, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Table, TableBody, TablePagination, TableRow} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {useRowMultipleSelection, useRowSelection} from '~/SelectorTypes/Picker/reactTable/plugins';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {
    cePickerClosePaths,
    cePickerMode,
    cePickerOpenPaths,
    cePickerPath,
    cePickerSetPage,
    cePickerSetPageSize,
    cePickerSetSort
} from '~/SelectorTypes/Picker/Picker2.redux';
import {flattenTree, getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import {batchActions} from 'redux-batched-actions';
import {
    ContentEmptyDropZone,
    ContentListHeader,
    ContentNotFound,
    ContentTableWrapper,
    EmptyTable,
    reactTable,
    UploadTransformComponent
} from '@jahia/jcontent';
import classes from './ContentTable.scss';
import {ContextualMenu, registry} from '@jahia/ui-extender';
import {useFieldContext} from '~/contexts/FieldContext';

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

const defaultCols = ['publicationStatus', 'name', 'type', 'lastModified'];

export const ContentTable = ({rows, isContentNotFound, totalCount, isLoading, isStructured}) => {
    const {t} = useTranslation();
    const field = useFieldContext();
    const dispatch = useDispatch();

    const {mode, pickerKey, path, pagination, searchTerm, openPaths, sort} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        pickerKey: state.contenteditor.picker.pickerKey,
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

    const tableConfig = registry.get('accordionItem', mode)?.tableConfig;

    const columns = useMemo(() => {
        const flattenRows = isStructured ? flattenTree(rows) : rows;
        const colNames = tableConfig?.columns || defaultCols;
        const columns = colNames.map(c => (typeof c === 'string') ? allColumnData.find(col => col.id === c) : c);
        const multiple = field.multiple && flattenRows.some(r => r.isSelectable);
        columns.splice((columns[0].id === 'publicationStatus') ? 1 : 0, 0, allColumnData.find(col => col.id === 'selection'));
        columns.push(allColumnData.find(col => col.id === 'visibleActions'));

        return columns
            .filter(c => multiple || c.id !== SELECTION_COLUMN_ID)
            .filter(c => tableConfig?.contextualMenu || c.id !== 'visibleActions');
    }, [field.multiple, tableConfig, rows, isStructured]);
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
    const contextualMenus = useRef({});

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
                                      uploadFilter={file => !tableConfig?.uploadFilter || tableConfig.uploadFilter(file, mode, pickerKey)}
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
                            contextualMenus.current[node.path] = contextualMenus.current[node.path] || React.createRef();

                            const openContextualMenu = event => {
                                contextualMenus.current[node.path].current(event);
                            };

                            return (
                                <TableRow key={'row' + row.id}
                                          {...rowProps}
                                          data-cm-role="table-content-list-row"
                                          data-sel-name={node.name}
                                          className={!selectionProps.checked && className}
                                          isHighlighted={selectionProps.checked && !field.multiple}
                                          onClick={e => handleOnClick(e, row)}
                                          onContextMenu={event => {
                                              if (tableConfig.contextualMenu) {
                                                  event.stopPropagation();
                                                  openContextualMenu(event);
                                              }
                                          }}
                                          onDoubleClick={() => allowDoubleClickNavigation(node.primaryNodeType.name) && doubleClickNavigation(node)}
                                >
                                    {tableConfig.contextualMenu && <ContextualMenu
                                        setOpenRef={contextualMenus.current[node.path]}
                                        actionKey={tableConfig.contextualMenu}
                                        path={node.path}
                                    />}
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
    totalCount: PropTypes.number.isRequired
};

export default ContentTable;
