import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
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

const ContentRowCmp = ({row, selected, columns, onClick, classes}) => {
    const [rowData, setRowData] = useState(row);

    const updateRowProperties = rowPropertiesToUpdate =>
        setRowData({...rowData, ...rowPropertiesToUpdate});

    // Sometimes some data for the row need to be loaded after the row is displayed
    const LazyRowLoader = row.lazyRowLoader;

    return (
        <TableRow key={rowData.id}
                  hover
                  className={classes.row + ' ' + (selected ? classes.selectedRow : '')}
                  role="checkbox"
                  selected={selected}
                  tabIndex={-1}
                  onClick={() => rowData.selectable && onClick(rowData)}
        >
            {LazyRowLoader ?
                <LazyRowLoader
                    updateRow={updateRowProperties}
                    row={row}
                /> :
                <></>}

            <TableCell padding="checkbox">
                {rowData.selectable && <Checkbox className={selected ? classes.selectedCheckbox : ''} checked={selected}/>}
            </TableCell>

            {columns.map(column => {
                const CellRenderer = column.renderer;
                return (
                    <TableCell key={rowData.id + ' ' + column.property}
                               className={classes.tableCell + ' ' + classes[column.property + 'Column']}
                    >
                        {CellRenderer ?
                            <CellRenderer
                                tableCellData={rowData[column.property]}
                                {...(rowData.props && rowData.props[column.property] ? rowData.props[column.property] : {})}
                            /> :
                            rowData[column.property]}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

ContentRowCmp.defaultProps = {
    onClick: () => {}
};

ContentRowCmp.propTypes = {
    row: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    columns: PropTypes.array.isRequired,
    onClick: PropTypes.func,
    classes: PropTypes.object.isRequired
};

export const ContentRow = withStyles(styles)(ContentRowCmp);
ContentRow.displayName = 'ContentRow';
