import React from 'react';
import {usePublicationInfoContext} from './PublicationInfo.context';
import {Badge} from '@jahia/design-system-kit';
import {useTranslation} from 'react-i18next';

export const PublicationInfoBadge = () => {
    const {t} = useTranslation();
    const {publicationInfoPolling} = usePublicationInfoContext();
    return (
        <>
            {publicationInfoPolling && <Badge data-sel-role="publication-info-polling-badge"
                                              badgeContent={t('content-editor:label.contentEditor.edit.action.publish.badge')}
                                              variant="normal"
                                              color="info"
            />}
        </>
    );
};

export default PublicationInfoBadge;
