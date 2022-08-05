import React, {useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Table, TableBody, TablePagination, TableRow} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {useExpanded, useRowSelection, useSort} from '~/SelectorTypes/Picker/reactTable/plugins';
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

export const ContentTable = ({rows, isContentNotFound, totalCount, isLoading}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {mode, path, pagination, tableView} = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        path: state.contenteditor.picker.path,
        pagination: state.contenteditor.picker.pagination,
        tableView: state.contenteditor.picker.tableView
    }), shallowEqual);

    const isStructuredView = Constants.tableView.mode.STRUCTURED === tableView.viewMode;

    const columns = useMemo(() => 'picker-' + Constants.mode.MEDIA === mode ? allColumnData.filter(c => c.id !== 'type') : allColumnData, [mode]);
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
        useRowSelection,
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
                {tableHeader}
                <ContentEmptyDropZone mode={mode} path={path}/>
            </>
        );
    }

    return (
        <>
            {tableHeader}
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
                                          onClick={e => allowDoubleClickNavigation(node.primaryNodeType.name) ? clickHandler.handleEvent(e, selectionProps.onChange) : selectionProps.onChange()}
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
    totalCount: PropTypes.number.isRequired
};

export default ContentTable;
