import React from 'react';
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useNodeInfo} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {Constants} from '~/ContentEditor.constants';

export const EditContent = ({context, render: Render, loading: Loading}) => {
    const {redirect} = useContentEditorHistory();
    const language = useSelector(state => state.language);
    const res = useNodeInfo({path: context.path, language}, {getDisplayName: true});

    if (Loading && res.loading) {
        return <Loading context={context}/>;
    }

    return (
        <Render context={{
            ...context,
            onClick: () => redirect({language, mode: Constants.routes.baseEditRoute, uuid: res.node.uuid})
        }}/>
    );
};

EditContent.defaultProps = {
    loading: undefined
};

EditContent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const EditContentAction = {
    component: EditContent
};

export default EditContentAction;
