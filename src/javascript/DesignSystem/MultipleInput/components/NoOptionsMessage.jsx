import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@jahia/design-system-kit';

export const NoOptionsMessage = props => {
    return (
        <Typography
            color="gamma"
            className={props.selectProps.styles.noOptionsMessage}
        >
            {props.children}
        </Typography>
    );
};

NoOptionsMessage.propTypes = {
    selectProps: PropTypes.shape({
        styles: PropTypes.shape({
            noOptionsMessage: PropTypes.string
        }).isRequired
    }).isRequired,
    children: PropTypes.string
};
