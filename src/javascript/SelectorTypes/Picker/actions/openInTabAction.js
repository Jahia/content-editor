import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorContext} from '~/contexts';
import {useApolloClient, useQuery} from '@apollo/react-hooks';
import rison from 'rison-node';
import {OpenInTabActionQuery} from '~/SelectorTypes/Picker/actions/openInTabAction.gql-queries';
import {jcontentUtils} from '@jahia/jcontent';

export const OpenInTabActionComponent = ({render: Render, loading: Loading, path, field, inputContext, ...others}) => {
    const {lang} = useContentEditorContext();
    const client = useApolloClient();

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
                jcontentUtils.expandTree({uuid}, client).then(({mode, parentPath, site}) => {
                    const hash = rison.encode_uri({contentEditor: [{uuid, lang, mode: Constants.routes.baseEditRoute, isFullscreen: true}]});
                    const url = jcontentUtils.buildUrl({site, language: lang, mode, path: parentPath});
                    window.open(`${window.contextJsParameters.urlbase}${url}#${hash}`, '_blank');
                });
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
