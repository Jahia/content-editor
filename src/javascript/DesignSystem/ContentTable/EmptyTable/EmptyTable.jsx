import React from 'react';
import PropTypes from 'prop-types';
import {TableBody, TableCell, TableRow, withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';

const styles = () => ({
    labelEmpty: {
        textAlign: 'center'
    }
});

const EmptyTable = ({labelEmpty, classes}) => (
    <TableBody>
        <TableRow>
            <TableCell colSpan={5}>
                <Typography className={classes.labelEmpty} variant="p">{labelEmpty}</Typography>
            </TableCell>
        </TableRow>
    </TableBody>
);

EmptyTable.propTypes = {
    labelEmpty: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EmptyTable);
