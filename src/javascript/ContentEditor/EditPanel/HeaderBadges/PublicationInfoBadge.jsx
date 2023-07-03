import React from 'react';
import {usePublicationInfoContext} from '~/contexts';
import {useTranslation} from 'react-i18next';
import {Constants} from '~/ContentEditor.constants';
import {PublicationStatus} from './PublicationStatus';
import {getTooltip} from './PublicationInfoBadge.tooltip';
import {useSelector} from 'react-redux';

export const PublicationInfoBadge = () => {
    const {t} = useTranslation('content-editor');
    const publicationInfoContext = usePublicationInfoContext();
    const uilang = useSelector(state => state.uilang);

    const statuses = {
        modified: false,
        published: false,
        warning: false
    };

    // This rules have been extracted from JContent, please maintain this rules to be consistent with JContent
    if (publicationInfoContext.publicationStatus) {
        if (publicationInfoContext.publicationStatus === Constants.editPanel.publicationStatus.MODIFIED) {
            statuses.modified = true;
            statuses.published = true;
        } else if (publicationInfoContext.publicationStatus === Constants.editPanel.publicationStatus.NOT_PUBLISHED) {
            statuses.published = false;
        } else if (publicationInfoContext.publicationStatus === Constants.editPanel.publicationStatus.PUBLISHED) {
            statuses.published = true;
        } else if (publicationInfoContext.publicationStatus === Constants.editPanel.publicationStatus.UNPUBLISHED) {
            statuses.published = false;
        } else if (publicationInfoContext.publicationStatus !== Constants.editPanel.publicationStatus.MARKED_FOR_DELETION) {
            statuses.warning = true;
        }
    }

    const supportedUiLang = Constants.supportedLocales.includes(uilang) ? uilang : Constants.defaultLocale;
    const renderStatus = type => (
        <PublicationStatus type={type} tooltip={getTooltip(type, publicationInfoContext, supportedUiLang, t)}/>
    );
    return (
        <>
            {!publicationInfoContext.publicationInfoPolling &&
            <>
                {statuses.modified && renderStatus('modified')}
                {!statuses.warning && renderStatus(statuses.published ? 'published' : 'notPublished')}
                {statuses.warning && renderStatus('warning')}
            </>}
            {publicationInfoContext.publicationInfoPolling && renderStatus('publishing')}
        </>
    );
};
