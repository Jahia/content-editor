import React from 'react';
import PropTypes from 'prop-types';

import {Input} from '@jahia/design-system-kit';
import {InputComponent} from './InputComponent';
import {withStyles} from '@material-ui/core';

const styles = theme => ({
    input: {
        paddingLeft: 0
    },
    readOnly: {
        background: theme.palette.ui.alpha,
        border: `1px solid ${theme.palette.ui.alpha}`
    }
});

export const ControlCmp = React.forwardRef(({classes, children, readOnly, innerProps}, ref) => {
    return (
        <Input
            ref={ref}
            fullWidth
            inputComponent={InputComponent}
            className={`${classes.input}
                        ${readOnly ? classes.readOnly : ''}`
            }
            inputProps={{
                inputRef: ref,
                children: children,
                ...innerProps
            }}
        />
    );
});

ControlCmp.default = {
    readOnly: false
};

ControlCmp.propTypes = {
    innerProps: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    readOnly: PropTypes.bool
};

export const Control = withStyles(styles)(ControlCmp);

Control.displayName = 'Control';
