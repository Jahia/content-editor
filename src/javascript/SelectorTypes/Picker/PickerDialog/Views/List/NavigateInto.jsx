import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@material-ui/core';
import {Subdirectory} from '@jahia/moonstone';

export const NavigateInto = ({tableCellData, ...props}) => {
    if (!tableCellData) {
        return '';
    }

    return (
        <Button {...props}><Subdirectory/></Button>
    );
};

NavigateInto.defaultProps = {
    tableCellData: false
};

NavigateInto.propTypes = {
    tableCellData: PropTypes.bool
};

NavigateInto.displayName = 'NavigateInto';
