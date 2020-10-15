import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';

export const GoToOption = ({setActiveOption, value, mode, render: Render, ...otherProps}) => {
    return (
        <>
            {mode === Constants.routes.baseEditRoute &&
            <Render
                {...otherProps}
                onClick={() => {
                    setActiveOption(value);
                }}
            />}
        </>
    );
};

GoToOption.propTypes = {
    render: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    setActiveOption: PropTypes.func.isRequired
};

const GoToOptionAction = {
    component: GoToOption
};

export default GoToOptionAction;
