import React from 'react';
import PropTypes from 'prop-types';

import {Input} from '../../Input';
import {InputComponent} from './InputComponent';
import {withStyles} from '@material-ui/core';

const styles = {
    input: {
        paddingLeft: 0
    }
};

export const ControlCmp = React.forwardRef(({classes, children, innerProps}, ref) => {
    return (
        <>
            <Input
                ref={ref}
                fullWidth
                inputComponent={InputComponent}
                className={classes.input}
                inputProps={{
                    inputRef: ref,
                    children: children,
                    ...innerProps
                }}
            />
        </>
    );
});

ControlCmp.propTypes = {
    innerProps: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired
};

export const Control = withStyles(styles)(ControlCmp);

Control.displayName = 'Control';
