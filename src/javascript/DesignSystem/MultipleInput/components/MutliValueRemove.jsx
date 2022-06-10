import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import {Close} from '@jahia/moonstone';

const styles = {
    buttonContainer: {
        marginLeft: '-6px',
        marginRight: '3px'
    }
};

const MultiValueRemoveCmp = ({classes, ...props}) => {
    return <Close {...props} className={classes.buttonContainer}/>;
};

MultiValueRemoveCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const MultiValueRemove = withStyles(styles)(MultiValueRemoveCmp);
MultiValueRemove.displayName = 'MutliValueRemove';
