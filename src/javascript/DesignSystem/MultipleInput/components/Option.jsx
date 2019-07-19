import React from 'react';
import PropTypes from 'prop-types';

import {MenuItem} from '@material-ui/core';
import {withStyles} from '@material-ui/core';

const styles = {
    item: {
        transition: 'none'
    }
};

export const OptionCmp = React.forwardRef(({classes, innerProps, children}, ref) => {
    return (
        <MenuItem
            buttonRef={ref}
            component="div"
            className={classes.item}
            {...innerProps}
        >
            {children}
        </MenuItem>
    );
});

OptionCmp.propTypes = {
    innerProps: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired
};

export const Option = withStyles(styles)(OptionCmp);
Option.displayName = 'Option';
