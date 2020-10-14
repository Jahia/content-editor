import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';

export const GoToOption = props => {
    const {setActiveOption, value, mode, render: Render} = props;
    return (
        <>
            {mode === Constants.routes.baseEditRoute &&
            <Render
                {...props}
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
