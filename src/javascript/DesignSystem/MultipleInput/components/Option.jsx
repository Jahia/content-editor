import React from 'react';
import PropTypes from 'prop-types';

import {MenuItem} from '@material-ui/core';
import {withStyles} from '@material-ui/core';

const styles = {
    item: {
        transition: 'none'
    }
};

export const OptionCmp = props => {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            className={props.classes.item}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
};

OptionCmp.propTypes = {
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    isFocused: PropTypes.bool.isRequired,
    innerProps: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired
};

export const Option = withStyles(styles)(OptionCmp);
Option.displayName = 'Option';
