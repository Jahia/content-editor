import React, {useCallback} from 'react';
import * as PropTypes from 'prop-types';
import {publishNode} from './publishNode';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorContext, usePublicationInfoContext} from '~/contexts';
import {useApolloClient} from '@apollo/react-hooks';
import {useTranslation} from 'react-i18next';
import {useNotifications} from '@jahia/react-material';
import {useFormikContext} from 'formik';
import {isDirty} from '~/utils';

const Publish = ({render: Render, loading: Loading, ...otherProps}) => {
    const notificationContext = useNotifications();
    const {publicationInfoPolling, publicationStatus, stopPublicationInfoPolling, startPublicationInfoPolling} = usePublicationInfoContext();
    const client = useApolloClient();
    const {t} = useTranslation();
    const {nodeData, lang, i18nContext, siteInfo} = useContentEditorContext();
    const formik = useFormikContext();
    const {hasPublishPermission, lockedAndCannotBeEdited} = nodeData;

    let disabled = true;
    const isVisible = hasPublishPermission;

    if (isVisible) {
        if (publicationInfoPolling && publicationStatus === Constants.editPanel.publicationStatus.PUBLISHED) {
            stopPublicationInfoPolling();
        }

        const dirty = isDirty(formik, i18nContext);

        const wipInfo = formik.values[Constants.wip.fieldName];
        disabled = publicationStatus === undefined ||
            publicationInfoPolling ||
            lockedAndCannotBeEdited ||
            dirty ||
            wipInfo.status === Constants.wip.status.ALL_CONTENT ||
            (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(lang)) ||
            [
                Constants.editPanel.publicationStatus.PUBLISHED,
                Constants.editPanel.publicationStatus.MANDATORY_LANGUAGE_UNPUBLISHABLE
            ].includes(publicationStatus);
    }

    const buttonLabel = publicationInfoPolling ?
        'content-editor:label.contentEditor.edit.action.publish.namePolling' :
        'content-editor:label.contentEditor.edit.action.publish.name';

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
            disabled={disabled}
            buttonLabel={buttonLabel}
            buttonLabelShort={(siteInfo?.languages?.length === 1) && !publicationInfoPolling ?
                'content-editor:label.contentEditor.edit.action.publish.shortName' : ''}
            buttonLabelParams={{language: lang}}
            isVisible={isVisible}
            onClick={onClick}
        />
    );
};

Publish.propTypes = {
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

export const publishAction = {
    component: Publish
};
