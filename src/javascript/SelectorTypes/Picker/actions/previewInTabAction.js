import React from 'react';
import PropTypes from 'prop-types';
import {useQuery} from '@apollo/react-hooks';
import {
    PreviewInTabActionQueryByPath,
    PreviewInTabActionQueryByUuid
} from '~/SelectorTypes/Picker/actions/previewInTabAction.gql-queries';

function getPath(data) {
    if (data.jcr.result?.previewAvailable) {
        return data.jcr.result.path;
    }

    if (data.jcr.result.displayableNode?.previewAvailable) {
        return data.jcr.result.displayableNode.path;
    }

    return false;
}

export const PreviewInTabActionComponent = ({
    render: Render,
    loading: Loading,
    path,
    field,
    inputContext,
    ...others
}) => {
    const uuid = inputContext?.actionContext?.fieldData?.[0]?.uuid;

    const {data, error, loading} = useQuery(path ? PreviewInTabActionQueryByPath : PreviewInTabActionQueryByUuid, {
        variables: {
            path, uuid
        },
        skip: !path && !uuid
    });

    if (loading || error || !data) {
        return false;
    }

    const displayablePath = getPath(data);
    return displayablePath && (
        <Render
            {...others}
            onClick={() => {
                window.open(`${window.contextJsParameters.baseUrl}${displayablePath}.html`, '_blank');
            }}
        />
    );
};

PreviewInTabActionComponent.propTypes = {
    path: PropTypes.string,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func,
    field: PropTypes.object,
    inputContext: PropTypes.object
};

export const previewInTabAction = {
    component: PreviewInTabActionComponent
};
