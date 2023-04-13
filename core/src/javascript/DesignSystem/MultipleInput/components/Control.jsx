import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';

const styles = theme => ({
    input: {
        paddingLeft: 0,
        borderRadius: '1px',
        background: theme.palette.ui.epsilon,
        border: `1px solid ${theme.palette.ui.omega}`,
        boxSizing: 'border-box',
        '&:hover': {
            border: `1px solid ${theme.palette.ui.zeta}`
        },
        fontSize: theme.typography.iota.fontSize,
        transitionDuration: '.3s',
        padding: '3px 0px 3px 12px',
        display: 'flex',
        minHeight: '44px'
    },
    focused: {
        border: `1px solid ${theme.palette.brand.beta}`
    },
    disabled: {
        background: theme.palette.ui.epsilon,
        border: `1px solid ${theme.palette.ui.zeta}`,
        color: theme.palette.font.gamma
    },
    readOnly: {
        background: theme.palette.ui.alpha,
        border: `1px solid ${theme.palette.ui.alpha}`
    }
});

export const ControlCmp = React.forwardRef(({classes, children, innerProps, isDisabled, isFocused, menuIsOpen, selectProps}, innerRef) => {
    const isReadOnly = selectProps.isReadOnly;
    return (
        <div
          ref={innerRef}
          className={`
              ${classes.input}
              ${isReadOnly ? classes.readOnly : ''}
              ${isDisabled ? classes.disabled : ''}
              ${isFocused ? classes.focused : ''}
              ${menuIsOpen ? classes.menuIsOpen : ''}
          `}
          {...innerProps}
        >
            {children}
        </div>
    );
});

ControlCmp.default = {
    isReadOnly: false
};

ControlCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    innerProps: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    selectProps: PropTypes.shape({
        isReadOnly: PropTypes.bool.isRequired
    }).isRequired,
    isDisabled: PropTypes.bool.isRequired,
    isFocused: PropTypes.bool.isRequired,
    menuIsOpen: PropTypes.bool.isRequired,
    innerRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({current: PropTypes.object})
    ])
};

export const Control = withStyles(styles)(ControlCmp);

Control.displayName = 'Control';
