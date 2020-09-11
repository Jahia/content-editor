import React from 'react';
import * as PropTypes from 'prop-types';
import {publishNode} from './publish.request';
import {Constants} from '~/ContentEditor.constants';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';

const Publish = ({context, values, dirty, hasPublishPermission, lockedAndCannotBeEdited, render: Render, loading: Loading}) => {
    const {publicationInfoPolling, publicationStatus, stopPublicationInfoPolling, startPublicationInfoPolling} = usePublicationInfoContext();

    let disabled = true;
    const enabled = hasPublishPermission;

    if (enabled) {
        if (publicationInfoPolling && publicationStatus === Constants.editPanel.publicationStatus.PUBLISHED) {
            stopPublicationInfoPolling();
        }

        const wipInfo = values[Constants.wip.fieldName];
        disabled = publicationStatus === undefined ||
            publicationInfoPolling ||
            lockedAndCannotBeEdited ||
            dirty ||
            wipInfo.status === Constants.wip.status.ALL_CONTENT ||
            (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(context.language)) ||
            [
                Constants.editPanel.publicationStatus.PUBLISHED,
                Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE
            ].includes(publicationStatus);
    }

    const buttonLabel = publicationInfoPolling ? 'content-editor:label.contentEditor.edit.action.publish.namePolling' : 'content-editor:label.contentEditor.edit.action.publish.name';

    if (Loading) {
        return <Loading context={context}/>;
    }

    return (
        <Render
            context={{
                ...context,
                enabled: enabled,
                disabled: disabled,
                buttonLabel: buttonLabel,
                onClick: context => {
                    publishNode({
                        client: context.client,
                        t: context.t,
                        notificationContext: context.notificationContext,
                        data: {
                            nodeData: context.nodeData,
                            language: context.language
                        },
                        successCallback: startPublicationInfoPolling()
                    });
                }
            }}
        />
    );
};

Publish.propTypes = {
    context: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    hasPublishPermission: PropTypes.bool.isRequired,
    lockedAndCannotBeEdited: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const publishButtonAction = {
    component: Publish
};

export default publishButtonAction;
