import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import {ContentTableHeader} from './ContentTableHeader';
import {EmptyTable} from './EmptyTable';

const styles = theme => ({
    tableWrapper: {
        flex: '1 1 0%',
        overflow: 'auto',
        position: 'relative'
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

const ContentTable = ({data, order, orderBy, columns, labelEmpty, classes, multipleSelectable, onSelect, initialSelection}) => {
    const [selection, setSelection] = useState(
        initialSelection
            .map(path => data.find(i => i.path === path))
            .filter(data => Boolean(data))
    );

    const onClickHandler = useCallback(content => {
        const selectedIndex = selection.findIndex(i => i.id === content.id);
        let newSelection;
        if (selectedIndex === -1) {
            newSelection = multipleSelectable ? [...selection, content] : [content];
        } else if (multipleSelectable) { // If it's an unselect for multipleSelectable
            newSelection = [...selection];
            newSelection.splice(selectedIndex, 1);
        } else { // If it's an unselect for singleSelectable then, set array empty
            newSelection = [];
        }

        setSelection(newSelection);
        onSelect(newSelection);
    }, [multipleSelectable, onSelect, selection]);
    return (
        <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
                <ContentTableHeader
                    columns={columns}
                    order={order}
                    orderBy={orderBy}
                />
                {data && data.length === 0 ?
                    <EmptyTable labelEmpty={labelEmpty}/> :
                    <TableBody>
                        {data.map(row => {
                            let selected = Boolean(selection.find(i => i.id === row.id));
                            return (
                                <TableRow key={row.id}
                                          hover
                                          className={classes.row + ' ' + (selected ? classes.selectedRow : '')}
                                          role="checkbox"
                                          selected={selected}
                                          tabIndex={-1}
                                          onClick={() => {
                                              onClickHandler(row);
                                          }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox className={selected ? classes.selectedCheckbox : ''} checked={selected}/>
                                    </TableCell>

                                    {columns.map(column => {
                                        const CellRenderer = column.renderer;
                                        return (
                                            <TableCell key={row.id + ' ' + column.property}
                                                       className={classes.tableCell + ' ' + classes[column.property + 'Column']}
                                            >
                                                {CellRenderer ?
                                                    <CellRenderer tableCellData={row[column.property]}/> :
                                                    row[column.property]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>}
            </Table>
        </div>
    );
};

ContentTable.defaultProps = {
    multipleSelectable: false,
    onSelect: () => {},
    initialSelection: []
};

ContentTable.propTypes = {
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
    multipleSelectable: PropTypes.bool,
    onSelect: PropTypes.func,
    initialSelection: PropTypes.array
};

export default withStyles(styles)(ContentTable);
