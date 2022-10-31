import React from 'react';
import PropTypes from 'prop-types';
import {useQuery} from '@apollo/react-hooks';
import {PreviewInTabActionQuery} from '~/SelectorTypes/Picker/actions/previewInTabAction.gql-queries';

export const PreviewInTabActionComponent = ({
    render: Render,
    loading: Loading,
    path,
    field,
    inputContext,
    ...others
}) => {
    let uuid;
    if (path === undefined) {
        const {fieldData} = inputContext.actionContext;
        uuid = fieldData[0].uuid;
    }

    const {data, error, loading} = useQuery(PreviewInTabActionQuery, {
        variables: {
            path: path
        },
        skip: !path
    });

    if (uuid === undefined && (loading || error || !data)) {
        return <></>;
    }

    uuid = uuid === undefined ? data.jcr.result.uuid : uuid;

    if (data !== undefined && !data.jcr.result.previewAvailable && data.jcr.result.displayableNode.previewAvailable) {
        path = data.jcr.result.displayableNode.path;
    } else {
        return <></>;
    }

    return (
        <Render
            {...others}
            onClick={() => {
                window.open(`${window.contextJsParameters.baseUrl}${path}.html`, '_blank');
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
