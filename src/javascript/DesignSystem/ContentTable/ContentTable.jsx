import React from 'react';
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
        position: 'relative',
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 9
    },
    table: {
        height: '100%'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default + '7F'
        },
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    }

});

const ContentTable = ({data, order, orderBy, columns, labelEmpty, classes}) => {
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
                            return (
                                <TableRow key={row.id}
                                          hover
                                          className={classes.row}
                                          role="checkbox"
                                          selected={false}
                                          tabIndex={-1}
                                          onClick={() => {
                                              // TODO: handle selection (manage selected & checked)
                                          }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={false}/>
                                    </TableCell>

                                    {columns.map(column => {
                                        return (
                                            <TableCell key={row.id}>{row[column.property]}</TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                }
            </Table>
        </div>
    );
};

ContentTable.propTypes = {
    data: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        createdBy: PropTypes.string.isRequired,
        lastModified: PropTypes.string.isRequired
    })).isRequired,
    columns: PropTypes.array.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    labelEmpty: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContentTable);
