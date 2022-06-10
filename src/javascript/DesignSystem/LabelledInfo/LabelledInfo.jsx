import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/design-system-kit';
import {withStyles} from '@material-ui/core';

const style = theme => ({
    container: {
        marginBottom: theme.spacing.unit * 2
    }
});

const LabelledInfoCmp = ({label, value, classes}) => {
    return (
        <div className={classes.container} data-sel-labelled-info={label}>
            <Typography variant="caption" color="gamma">{label}</Typography>
            <Typography variant="omega" color="alpha">{value}</Typography>
        </div>
    );
};

LabelledInfoCmp.defaultProps = {
    label: '',
    value: ''
};

LabelledInfoCmp.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export const LabelledInfo = withStyles(style)(LabelledInfoCmp);

LabelledInfo.displayName = 'LabelledInfo';
