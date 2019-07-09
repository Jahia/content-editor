import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

const styles = {
    input: {
        display: 'flex',
        padding: 0
    }
};

const InputComponentCmp = ({inputRef, classes, className, ...props}) => {
    return (
        <div
            ref={inputRef}
            className={`${classes.input} ${className}`}
            {...props}
        />
    );
};

InputComponentCmp.defaultProps = {
    className: ''
};

InputComponentCmp.propTypes = {
    inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
};

export const InputComponent = withStyles(styles)(InputComponentCmp);

InputComponent.displayName = 'InputComponent';
