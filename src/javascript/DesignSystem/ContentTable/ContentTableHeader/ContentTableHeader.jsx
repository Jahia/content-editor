import {TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const ContentTableHeader = ({columns, order, orderBy, onSort}) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {/* TODO: handle global Checkbox */}
                </TableCell>
                {columns.map(column => (
                    <TableCell key={column.property}
                               sortDirection={orderBy === column.property ? order : false}
                    >
                        <TableSortLabel active={orderBy === column.property}
                                        direction={order.toLowerCase()}
                                        onClick={() => onSort(column)}
                        >
                            {column.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

ContentTableHeader.defaultProps = {
    onSort: () => {}
};

ContentTableHeader.propTypes = {
    columns: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        property: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    onSort: PropTypes.func
};

export {ContentTableHeader};
