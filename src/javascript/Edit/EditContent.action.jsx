import React from 'react';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useNodeChecks} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {Constants} from '~/ContentEditor.constants';
import {useTranslation} from "react-i18next";

export const EditContent = ({path, render: Render, loading: Loading, ...otherProps}) => {
    const {redirect} = useContentEditorHistory();
    useTranslation('content-editor');
    const {language} = useSelector(state => ({language: state.language}));
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
                onClick={() => redirect({language, mode: Constants.routes.baseEditRoute, uuid: res.node.uuid})}
        />
    );
};

EditContent.defaultProps = {
    loading: undefined
};

EditContent.propTypes = {
    path: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const EditContentAction = {
    component: EditContent
};

export default EditContentAction;
