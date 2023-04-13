import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorContext} from '~/contexts/ContentEditor';

export const GoToOption = ({setActiveOption, value, render: Render, ...otherProps}) => {
    const {mode} = useContentEditorContext();

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
    setActiveOption: PropTypes.func.isRequired
};

export const goToOptionAction = {
    component: GoToOption
};
