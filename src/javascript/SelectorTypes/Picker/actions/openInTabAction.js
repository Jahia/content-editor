import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorContext} from '~/contexts';
import {useQuery} from '@apollo/react-hooks';
import rison from 'rison-node';
import {OpenInTabActionQuery} from '~/SelectorTypes/Picker/actions/openInTabAction.gql-queries';

export const OpenInTabActionComponent = ({render: Render, loading: Loading, path, field, inputContext, ...others}) => {
    const {lang} = useContentEditorContext();

    let uuid;
    if (path === undefined) {
        const {fieldData} = inputContext.actionContext;
        uuid = fieldData?.[0]?.uuid;
    }

    const {data, error, loading} = useQuery(OpenInTabActionQuery, {
        variables: {
            path: path
        },
        skip: !path
    });

    if (uuid === undefined && (loading || error || !data)) {
        return <></>;
    }

    uuid = uuid === undefined ? data.jcr.result.uuid : uuid;

    return (
        <Render
            {...others}
            onClick={() => {
                const hash = rison.encode_uri({contentEditor: [{uuid, lang, mode: Constants.routes.baseEditRoute, isFullscreen: true}]});

                // Todo : Reuse the logic from locate in jcontent when merge is done
                const location = window.location;
                window.open(`${location}#${hash}`, '_blank');
            }}
        />
    );
};

OpenInTabActionComponent.propTypes = {
    path: PropTypes.string,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func,
    field: PropTypes.object,
    inputContext: PropTypes.object
};

export const openInTabAction = {
    component: OpenInTabActionComponent
};
