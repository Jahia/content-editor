import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import React from 'react';

const ContentTableHeader = ({columns, order, orderBy}) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox indeterminate/>
                </TableCell>
                {columns.map(column => (
                    <TableCell
                        key={column.id}
                        sortDirection={orderBy === column.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === column.id}
                            direction={order}
                            onClick={() => {
                                // TODO: handle sort
                            }}
                        >
                            {column.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

ContentTableHeader.propTypes = {
    columns: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired
};

export {ContentTableHeader};
