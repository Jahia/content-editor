import {Badge, Paper} from '@jahia/design-system-kit';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styles from './Preview.scss';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {PreviewFetcher} from './Preview.fetcher';
import {UpdateOnSaveBadge} from '~/editorTabs/EditPanelContent/Preview/UpdateOnSaveBadge';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

export const Preview = () => {
    const {t} = useTranslation('content-editor');
    const editorContext = useContentEditorContext();
    const [contentNotFound, setContentNotFound] = useState(false);
    const handleContentNotFound = useCallback(() => setContentNotFound(true), []);
    const [shouldDisplayPreview, setShouldDisplayIframe] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShouldDisplayIframe(true);
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <Paper className={styles.content}>
            <div className={styles.container}>
                <UpdateOnSaveBadge/>
                {contentNotFound &&
                    <div>
                        <Badge
                            badgeContent={t('content-editor:label.contentEditor.preview.contentNotFound')}
                            variant="normal"
                            color="warning"
                        />
                    </div>}
                {editorContext.nodeData.isFolder &&
                    <div>
                        <Badge
                            badgeContent={t('content-editor:label.contentEditor.preview.noPreview')}
                            variant="normal"
                            color="warning"
                        />
                    </div>}
            </div>
            {!editorContext.nodeData.isFolder &&
                <>
                    {shouldDisplayPreview ?
                        <PreviewFetcher onContentNotFound={handleContentNotFound}/> :
                        <LoaderOverlay/>}
                </>}
        </Paper>
    );
};
