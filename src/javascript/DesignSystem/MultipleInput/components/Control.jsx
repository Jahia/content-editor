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

export const ControlCmp = props => {
    return (
        <>
            <Input
                ref={props.innerRef}
                fullWidth
                inputComponent={InputComponent}
                className={props.classes.input}
                inputProps={{
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps
                }}
            />
        </>
    );
};

ControlCmp.propTypes = {
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    innerProps: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired
};

export const Control = withStyles(styles)(ControlCmp);

Control.displayName = 'Control';
