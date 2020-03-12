import React from 'react';
import {Chip} from '@jahia/moonstone';
import {FileContent} from '@jahia/moonstone/dist/icons';
import {usePublicationInfoContext} from './PublicationInfo.context';
import {useTranslation} from 'react-i18next';

export const PublicationInfoBadge = () => {
    const {t} = useTranslation();
    const {publicationInfoPolling} = usePublicationInfoContext();
    return (
        <>
            {publicationInfoPolling &&
            <Chip
                data-sel-role="publication-info-polling-badge"
                label={t('content-editor:label.contentEditor.edit.action.publish.badge')}
                icon={<FileContent/>}
                color="default"
            />}
        </>
    );
};

export default PublicationInfoBadge;
