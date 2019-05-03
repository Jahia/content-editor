import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';

const styles = theme => ({
    checkBoxChecked: {
        fill: theme.palette.brand.alpha,
        '&:active': {
            fill: theme.palette.brand.beta
        }
    },
    checkBoxUnchecked: {
        '& rect': {
            // TODO replace next line by "fill: theme.palette.fields.alpha,""
            fill: '#F9FBFC',
            stroke: theme.palette.ui.delta,
            '&:focus, &:hover': {
                stroke: theme.palette.brand.alpha
            }
        }
    }
});

const CheckBoxCmp = ({checked, classes, className}) => {
    if (checked) {
        return (
            <svg data-sel-role-checkbox="checked" viewBox="0 0 24 24" className={`${classes.checkBoxChecked} ${className}`}>
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
        );
    }

    return (
        <svg data-sel-role-checkbox="unchecked" viewBox="0 0 24 24" className={`${classes.checkBoxUnchecked} ${className}`}>
            <rect x="4" y="4" width="16" height="16" rx="1"/>
        </svg>
    );
};

CheckBoxCmp.defaultProps = {
    className: ''
};

CheckBoxCmp.propTypes = {
    checked: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
};

export const CheckBox = withStyles(styles)(CheckBoxCmp);

CheckBox.displayName = 'CheckBox';
