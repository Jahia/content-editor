import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/design-system-kit';
import {withStyles} from '@material-ui/core';

const style = theme => ({
    icon: {
        height: '1rem',
        maxWidth: '1rem',
        float: 'left'
    },
    label: {
        marginLeft: '1.5rem',
        color: theme.palette.ui.gamma
    }
});

const IconLabelCmp = ({label, classes, iconURL}) => {
    return (
        <>
            <img className={classes.icon} src={iconURL} alt=""/>
            <Typography className={classes.label} component="span" variant="zeta">
                {label}
            </Typography>
        </>
    );
};

IconLabelCmp.defaultProps = {
    label: '',
    iconURL: ''
};

IconLabelCmp.propTypes = {
    label: PropTypes.string,
    iconURL: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export const IconLabel = withStyles(style)(IconLabelCmp);

IconLabel.displayName = 'IconLabel';
