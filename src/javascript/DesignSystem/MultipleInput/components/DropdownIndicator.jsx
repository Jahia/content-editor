import React from 'react';
import PropTypes from 'prop-types';
import {ChevronDown} from '@jahia/moonstone';
import {withStyles} from '@material-ui/core';

const styles = theme => ({
    container: {
        marginRight: theme.spacing.unit
    }
});

export const DropdownIndicatorCmp = props => {
    return (
        <div className={props.classes.container} {...props.innerProps}>
            <ChevronDown/>
        </div>
    );
};

DropdownIndicatorCmp.propTypes = {
    innerProps: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

export const DropdownIndicator = withStyles(styles)(DropdownIndicatorCmp);

DropdownIndicator.displayName = 'DropdownIndicator';
