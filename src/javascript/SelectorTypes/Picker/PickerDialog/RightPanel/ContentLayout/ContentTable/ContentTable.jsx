import React, {useEffect, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Table, TableBody, TablePagination} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {useRowMultipleSelection, useRowSelection} from '~/SelectorTypes/Picker/reactTable/plugins';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {
    cePickerClosePaths,
    cePickerMode,
    cePickerOpenPaths,
    cePickerPath,
    cePickerSetPage,
    cePickerSetPageSize,
    cePickerSetSort
} from '~/SelectorTypes/Picker/Picker.redux';
import {flattenTree, getDetailedPathArray} from '~/SelectorTypes/Picker/Picker.utils';
import {batchActions} from 'redux-batched-actions';
import {
    ContentEmptyDropZone,
    ContentListHeader,
    ContentNotFound,
    ContentTableWrapper,
    EmptyTable,
    jcontentUtils,
    reactTable,
    useFileDrop
} from '@jahia/jcontent';
import {registry} from '@jahia/ui-extender';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {Row} from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout/ContentTable/Row';
import clsx from 'clsx';

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

export const ContentTable = ({rows, isContentNotFound, totalCount, isLoading, isStructured, pickerConfig, isMultiple, accordionItemProps}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {mode, preSearchModeMemo, path, pagination, searchTerm, openPaths, sort} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        preSearchModeMemo: state.contenteditor.picker.preSearchModeMemo,
        path: state.contenteditor.picker.path,
        pagination: state.contenteditor.picker.pagination,
        searchTerm: state.contenteditor.picker.searchTerms,
        openPaths: state.contenteditor.picker.openPaths,
        sort: state.contenteditor.picker.sort
    }), shallowEqual);

    const previousMode = mode === Constants.mode.SEARCH ? preSearchModeMemo : mode;
    const previousModeTableConfig = useMemo(() => {
        return jcontentUtils.getAccordionItem(registry.get('accordionItem', previousMode), accordionItemProps)?.tableConfig;
    }, [previousMode, accordionItemProps]);
    const tableConfig = useMemo(() => {
        return jcontentUtils.getAccordionItem(registry.get('accordionItem', mode), accordionItemProps)?.tableConfig;
    }, [mode, accordionItemProps]);

    const allowDoubleClickNavigation = nodeType => {
        return Constants.mode.SEARCH !== mode &&
            ((tableConfig.canAlwaysDoubleClickOnType && tableConfig.canAlwaysDoubleClickOnType(nodeType)) || (!isStructured && (['jnt:folder', 'jnt:contentFolder'].includes(nodeType))));
    };

    const columns = useMemo(() => {
        const flattenRows = isStructured ? flattenTree(rows) : rows;
        const colNames = previousModeTableConfig?.columns || defaultCols;
        const columns = colNames
            .map(c => (typeof c === 'string') ? allColumnData.find(col => col.id === c) : c)
            .map(c => ({
                Cell: reactTable.Cell,
                Header: reactTable.Header,
                ...c
            }));
        const multiple = isMultiple && flattenRows.some(r => r.isSelectable);
        columns.splice((columns[0].id === 'publicationStatus') ? 1 : 0, 0, allColumnData.find(col => col.id === 'selection'));
        columns.push(allColumnData.find(col => col.id === 'visibleActions'));

        return columns
            .filter(c => multiple || c.id !== SELECTION_COLUMN_ID)
            .filter(c => previousModeTableConfig?.contextualMenu || c.id !== 'visibleActions');
    }, [isMultiple, previousModeTableConfig, rows, isStructured]);
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
        isMultiple ? useRowMultipleSelection : useRowSelection,
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

    const [{isCanDrop}, drop] = useFileDrop({
        uploadType: tableConfig?.uploadType,
        uploadPath: path,
        uploadFilter: file => !tableConfig?.uploadFilter || tableConfig.uploadFilter(file, mode, pickerConfig)
    });

    if (isContentNotFound) {
        return <ContentNotFound columnSpan={allColumnData.length} t={t}/>;
    }

    const tableHeader = tableConfig?.tableHeader && React.cloneElement(tableConfig?.tableHeader, {pickerConfig});

    if (!rows?.length && !isLoading) {
        if ((mode === Constants.mode.SEARCH)) {
            return <EmptyTable text={searchTerm}/>;
        }

        return (
            <>
                {tableHeader}
                <ContentEmptyDropZone reference={drop} uploadType={tableConfig?.uploadType} isCanDrop={isCanDrop}/>
            </>
        );
    }

    const handleOnClick = (e, row) => {
        if (isMultiple) {
            return; // Use selection column instead of row click for multiple selection
        }

        const selectionProps = row.getToggleRowSelectedProps();
        if (allowDoubleClickNavigation(row.original.primaryNodeType.name)) {
            clickHandler.handleEvent(e, selectionProps.onChange);
        } else {
            selectionProps.onChange();
        }
    };

    const handleOnDoubleClick = (e, row) => {
        if (allowDoubleClickNavigation(row.original.primaryNodeType.name)) {
            doubleClickNavigation(row.original);
        }
    };

    return (
        <div ref={drop} className={clsx({'moonstone-drop_card': isCanDrop}, 'flexFluid', 'flexCol')}>
            {tableHeader}
            <ContentTableWrapper isCanDrop={isCanDrop}
                                 reference={mainPanelRef}
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
                            return (
                                <Row key={'row' + row.id}
                                     isStructured={isStructured}
                                     row={row}
                                     isMultiple={isMultiple}
                                     tableConfig={tableConfig}
                                     handleOnClick={handleOnClick}
                                     handleOnDoubleClick={handleOnDoubleClick}
                                     previousModeTableConfig={previousModeTableConfig}
                                     doubleClickNavigation={doubleClickNavigation}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </ContentTableWrapper>
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
        </div>
    );
};

ContentTable.propTypes = {
    isContentNotFound: PropTypes.bool,
    isLoading: PropTypes.bool,
    isStructured: PropTypes.bool,
    rows: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    pickerConfig: configPropType.isRequired,
    isMultiple: PropTypes.bool,
    accordionItemProps: PropTypes.object
};

export default ContentTable;
