import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {Table, TableBody, withStyles} from '@material-ui/core';
import {ContentTableHeader} from './ContentTableHeader';
import {EmptyTable} from './EmptyTable';
import InfiniteScroll from 'react-infinite-scroller';
import {ContentRow} from './ContentRow';

const styles = theme => ({
    tableWrapper: {
        position: 'relative',
        height: '100%',
        width: '100%'
    },
    tableScroll: {
        height: '100%',
        width: '100%',
        overflow: 'auto'
    },
    table: {
        width: '100%'
    },
    nameColumn: {
        maxWidth: 0,
        width: '50%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default + '7F'
        },
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    selectedRow: {
        '&&&': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white
        }
    },
    tableCell: {
        color: 'inherit'
    },
    selectedCheckbox: {
        color: `${theme.palette.common.white} !important`
    }
});

const ContentTableCmp = ({
    data,
    order,
    orderBy,
    columns,
    labelEmpty,
    classes,
    isMultipleSelectable,
    onSelect,
    initialSelection,
    hasMore,
    loadMore,
    onSort
}) => {
    const [selection, setSelection] = useState(
        initialSelection
            .map(path => data.find(i => i.path === path))
            .filter(data => Boolean(data))
    );

    const onClickHandler = useCallback(content => {
        const selectedIndex = selection.findIndex(i => i.id === content.id);
        let newSelection;
        if (selectedIndex === -1) {
            newSelection = isMultipleSelectable ? [...selection, content] : [content];
        } else if (isMultipleSelectable) { // If it's an unselect for multipleSelectable
            newSelection = [...selection];
            newSelection.splice(selectedIndex, 1);
        } else { // If it's an unselect for singleSelectable then, set array empty
            newSelection = [];
        }

        setSelection(newSelection);
        onSelect(newSelection);
    }, [isMultipleSelectable, onSelect, selection]);

    return (
        <div className={classes.tableWrapper}>
            <div className={classes.tableScroll} data-sel-role="table-scrollable">
                <InfiniteScroll
                pageStart={0}
                hasMore={hasMore}
                loadMore={loadMore}
                useWindow={false}
                >
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <ContentTableHeader
                            columns={columns}
                            order={order}
                            orderBy={orderBy}
                            onSort={onSort}
                        />
                        {data && data.length === 0 ?
                            <EmptyTable labelEmpty={labelEmpty}/> :
                            <TableBody>
                                {data.map(row => {
                                    let selected = Boolean(selection.find(i => i.id === row.id));
                                    return (
                                        <ContentRow key={row.id}
                                                    row={row}
                                                    selected={selected}
                                                    columns={columns}
                                                    onClick={onClickHandler}
                                        />
                                    );
                                })}
                            </TableBody>}
                    </Table>
                </InfiniteScroll>
            </div>
        </div>
    );
};

ContentTableCmp.defaultProps = {
    isMultipleSelectable: false,
    onSelect: () => {},
    initialSelection: [],
    hasMore: false,
    loadMore: () => {},
    onSort: null
};

ContentTableCmp.propTypes = {
    data: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        createdBy: PropTypes.string,
        lastModified: PropTypes.string
    })).isRequired,
    columns: PropTypes.array.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    labelEmpty: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    isMultipleSelectable: PropTypes.bool,
    onSelect: PropTypes.func,
    initialSelection: PropTypes.array,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    onSort: PropTypes.func
};

export const ContentTable = withStyles(styles)(ContentTableCmp);
