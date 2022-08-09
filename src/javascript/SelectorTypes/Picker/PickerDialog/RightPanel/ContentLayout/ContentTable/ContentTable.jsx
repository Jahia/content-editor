import React, {useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Table, TableBody, TablePagination, TableRow} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {useExpanded, useRowMultipleSelection, useRowSelection, useSort} from '~/SelectorTypes/Picker/reactTable/plugins';
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

export const allowDoubleClickNavigation = nodeType => {
    return (['jnt:folder', 'jnt:contentFolder'].indexOf(nodeType) !== -1);
};

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
            fcn();
        }
    }
};

const SELECTION_COLUMN_ID = 'selection';

export const ContentTable = ({rows, isContentNotFound, totalCount, isLoading, canSelectPages, pickerConfig}) => {
    const {t} = useTranslation();
    const field = useFieldContext();
    const dispatch = useDispatch();

    const {mode, path, pagination, tableView} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        pagination: state.contenteditor.picker.pagination,
        tableView: state.contenteditor.picker.tableView
    }), shallowEqual);

    const isStructuredView = Constants.tableView.mode.STRUCTURED === tableView.viewMode;
    const columns = useMemo(() => {
        return allColumnData
            .filter(c => 'picker-' + Constants.mode.MEDIA !== mode || c.id !== 'type') // Do not include type column if media mode
            .filter(c => field.multiple || c.id !== SELECTION_COLUMN_ID) // Do not include selection if multiple selection is not enabled
            .filter(c => !pickerConfig?.pickerTable?.columns || [...pickerConfig.pickerTable.columns, SELECTION_COLUMN_ID].includes(c.id)); // Check if picker config specifies which columns to include
    }, [mode, field.multiple, pickerConfig]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: tableRows,
        prepareRow,
        toggleAllRowsExpanded
    } = useTable(
        {
            columns: columns,
            data: rows
        },
        field.multiple ? useRowMultipleSelection : useRowSelection,
        useSort,
        useExpanded
    );

    useEffect(() => {
        if (isStructuredView) {
            toggleAllRowsExpanded(true);
        }
    }, [rows, isStructuredView, toggleAllRowsExpanded]);

    const doubleClickNavigation = node => {
        const actions = [];

        if (mode === 'picker-' + Constants.mode.SEARCH) {
            const newMode = registry.find({type: 'accordionItem', target: 'jcontent'}).find(acc => acc.canDisplayItem(node))?.key;
            if (newMode) {
                actions.push(reduxActions.setModeAction(newMode));
            }
        }

        actions.push(reduxActions.setOpenPathAction(node.path));
        actions.push(reduxActions.setPathAction(node.path));
        dispatch(batchActions(actions));
    };

    if (isContentNotFound) {
        return <ContentNotFound columnSpan={allColumnData.length} t={t}/>;
    }

    const tableHeader = registry.get('accordionItem', mode)?.tableHeader;

    if (_.isEmpty(rows) && !isLoading) {
        if ((mode === 'picker-' + Constants.mode.SEARCH)) {
            return <EmptyTable columnSpan={allColumnData.length} t={t}/>;
        }

        return (
            <>
                {canSelectPages && tableHeader}
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
            {canSelectPages && tableHeader}
            <UploadTransformComponent uploadTargetComponent={ContentTableWrapper}
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
                                          className={!selectionProps.checked && className}
                                          isHighlighted={selectionProps.checked}
                                          onClick={e => handleOnClick(e, row)}
                                          onDoubleClick={e => allowDoubleClickNavigation(node.primaryNodeType.name) && clickHandler.handleEvent(e, () => doubleClickNavigation(node))}
                                >
                                    {row.cells.map(cell => <React.Fragment key={cell.column.id}>{cell.render('Cell')}</React.Fragment>)}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </UploadTransformComponent>
            {!isStructuredView &&
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
    rows: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    canSelectPages: PropTypes.bool.isRequired,
    pickerConfig: configPropType.isRequired
};

export default ContentTable;
