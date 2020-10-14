import React from 'react';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useNodeChecks} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {Constants} from '~/ContentEditor.constants';

export const EditContent = props => {
    const {path, render: Render, loading: Loading} = props;
    const {redirect} = useContentEditorHistory();
    const {language} = useSelector(state => ({language: state.language}));
    const res = useNodeChecks(
        {path: path, language: language},
        {...props}
    );

    if (Loading && res.loading) {
        return <Loading {...props}/>;
    }

    return (
        <Render {...props}
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
