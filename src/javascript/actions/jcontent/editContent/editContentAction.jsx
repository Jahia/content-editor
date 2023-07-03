import React from 'react';
import {useNodeChecks} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';

export const EditContent = ({
    path,
    isFullscreen,
    editCallback,
    render: Render,
    loading: Loading,
    ...otherProps
}) => {
    useTranslation('content-editor');
    const api = useContentEditorApiContext();
    const language = useSelector(state => state.language);
    const res = useNodeChecks(
        {path: path, language: language},
        {...otherProps}
    );

    if (Loading && res.loading) {
        return <Loading {...otherProps}/>;
    }

    return (
        <Render {...otherProps}
                isVisible={res.checksResult}
                onClick={() => api.edit({
                    uuid: res.node.uuid,
                    lang: language,
                    isFullscreen,
                    editCallback,
                    ...otherProps.editConfig
                })}
        />
    );
};

EditContent.defaultProps = {
    loading: undefined,
    isFullscreen: false,
    editCallback: undefined
};

EditContent.propTypes = {
    path: PropTypes.string.isRequired,
    isFullscreen: PropTypes.bool,
    editCallback: PropTypes.func,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

export const editContentAction = {
    component: EditContent
};
