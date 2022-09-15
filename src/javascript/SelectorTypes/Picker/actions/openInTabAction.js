import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {shallowEqual, useSelector} from 'react-redux';

export const OpenInTabActionComponent = ({render: Render, loading: Loading, uuid, ...others}) => {
    const {lang} = useSelector(state => ({
        lang: state.language
    }), shallowEqual);

    return (
        <Render
            {...others}
            onClick={() => {
                window.open(`${window.contextJsParameters.urlbase}/${Constants.appName}/${lang}/${Constants.routes.baseEditRoute}/${uuid}`, '_blank');
            }}
        />
    );
};

OpenInTabActionComponent.propTypes = {
    uuid: PropTypes.string,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};

export const openInTabAction = {
    component: OpenInTabActionComponent
};
