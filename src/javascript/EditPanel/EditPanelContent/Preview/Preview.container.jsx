import {Badge, Paper} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import React, {useEffect, useState, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import classes from './Preview.container.scss';
import {ProgressOverlay} from '@jahia/react-material';
import {useContentEditorContext} from '~/ContentEditor.context';
import {PreviewFetcher} from './Preview.fetcher';
import {Button} from '@jahia/moonstone';

export const PreviewContainer = ({isDirty, switchDisplay}) => {
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
        <Paper className={classes.content}>
            <div className={classes.container}>
                {isDirty &&
                    <div>
                        <Badge className={classes.badge}
                               badgeContent={t('content-editor:label.contentEditor.preview.updateOnSave')}
                               variant="normal"
                               color="info"
                        />
                    </div>}
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
                <di>
                    <Button
                    label="Show Compare"
                    onClick={() => switchDisplay()}
                />
                </di>
            </div>
            {!editorContext.nodeData.isFolder &&
                <>
                    {shouldDisplayPreview ?
                        <PreviewFetcher onContentNotFound={handleContentNotFound}/> :
                        <ProgressOverlay/>}
                </>}
        </Paper>
    );
};

PreviewContainer.defaultProps = {
    isDirty: false
};

PreviewContainer.propTypes = {
    isDirty: PropTypes.bool,
    switchDisplay: PropTypes.func.isRequired
};
