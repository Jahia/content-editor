import React, {useCallback} from 'react';
import * as PropTypes from 'prop-types';
import {publishNode} from './publish.request';
import {Constants} from '~/ContentEditor.constants';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import {useApolloClient} from '@apollo/react-hooks';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {withNotifications} from '@jahia/react-material';
import {useFormikContext} from 'formik';

const Publish = ({notificationContext, render: Render, loading: Loading, ...otherProps}) => {
    const {publicationInfoPolling, publicationStatus, stopPublicationInfoPolling, startPublicationInfoPolling} = usePublicationInfoContext();
    const client = useApolloClient();
    const {t} = useTranslation();
    const {nodeData, lang} = useContentEditorContext();
    const formik = useFormikContext();
    const {hasPublishPermission, lockedAndCannotBeEdited} = nodeData;

    let disabled = true;
    const enabled = hasPublishPermission;

    if (enabled) {
        if (publicationInfoPolling && publicationStatus === Constants.editPanel.publicationStatus.PUBLISHED) {
            stopPublicationInfoPolling();
        }

        const wipInfo = formik.values[Constants.wip.fieldName];
        disabled = publicationStatus === undefined ||
            publicationInfoPolling ||
            lockedAndCannotBeEdited ||
            formik.dirty ||
            wipInfo.status === Constants.wip.status.ALL_CONTENT ||
            (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(lang)) ||
            [
                Constants.editPanel.publicationStatus.PUBLISHED,
                Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE
            ].includes(publicationStatus);
    }

    const buttonLabel = publicationInfoPolling ? 'content-editor:label.contentEditor.edit.action.publish.namePolling' : 'content-editor:label.contentEditor.edit.action.publish.name';

    let onClick = useCallback(() => {
        publishNode({
            client,
            t,
            notificationContext,
            data: {
                nodeData,
                language: lang
            },
            successCallback: startPublicationInfoPolling
        });
    }, [client, t, notificationContext, nodeData, lang, startPublicationInfoPolling]);

    if (Loading) {
        return <Loading {...otherProps}/>;
    }

    return (
        <Render
            {...otherProps}
            enabled={enabled}
            disabled={disabled}
            buttonLabel={buttonLabel}
            onClick={onClick}
        />
    );
};

Publish.propTypes = {
    notificationContext: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const publishButtonAction = {
    component: withNotifications()(Publish)
};

export default publishButtonAction;
