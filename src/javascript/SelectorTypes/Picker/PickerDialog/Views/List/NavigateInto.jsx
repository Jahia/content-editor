import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Button} from '@material-ui/core';
import {SubdirectoryArrowRight} from '@material-ui/icons';

const styles = theme => ({
    button: {
        color: theme.palette.ui.delta
    }
});

const NavigateIntoCmp = ({tableCellData, ...props}) => {
    if (!tableCellData) {
        return '';
    }

    return (
        <Button {...props}><SubdirectoryArrowRight/></Button>
    );
};

NavigateIntoCmp.propTypes = {
    // Classes: PropTypes.object.isRequired,
    tableCellData: PropTypes.object.isRequired
};

export const NavigateInto = withStyles(styles)(NavigateIntoCmp);
NavigateIntoCmp.displayName = 'NavigateInto';
