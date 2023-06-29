import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorContext} from '~/contexts';
import {useQuery} from '@apollo/react-hooks';
import {
    OpenInTabActionQueryPath,
    OpenInTabActionQueryUuid
} from '~/SelectorTypes/Picker/actions/openInTabAction.gql-queries';
import rison from 'rison-node';

export const OpenInTabActionComponent = ({render: Render, loading: Loading, path, field, inputContext, ...others}) => {
    const {lang} = useContentEditorContext();

    const queryInfo = (path === undefined) ? ({
        variables: {uuid: inputContext.actionContext?.fieldData?.[0]?.uuid},
        query: OpenInTabActionQueryUuid
    }) : ({
        variables: {path: path},
        query: OpenInTabActionQueryPath
    });

    const {data, error, loading} = useQuery(queryInfo.query, {variables: queryInfo.variables});

    if (loading || error || !data) {
        return <></>;
    }

    const uuid = data.jcr.result.uuid;
    const site = data.jcr.result.site;
    return (
        <Render
            {...others}
            onClick={() => {
                const hash = rison.encode_uri({contentEditor: [{uuid, site: site.name, lang, mode: Constants.routes.baseEditRoute, isFullscreen: true}]});

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
