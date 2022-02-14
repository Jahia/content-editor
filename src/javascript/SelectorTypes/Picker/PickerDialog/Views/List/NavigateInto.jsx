import React from 'react';
import PropTypes from 'prop-types';
import {Button, withStyles} from '@material-ui/core';
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

NavigateIntoCmp.defaultProps = {
    tableCellData: false
};

NavigateIntoCmp.propTypes = {
    tableCellData: PropTypes.bool
};

export const NavigateInto = withStyles(styles)(NavigateIntoCmp);
NavigateIntoCmp.displayName = 'NavigateInto';
