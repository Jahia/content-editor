import {Badge, Paper} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import React, {useState, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import classes from './Preview.container.scss';
import {ProgressOverlay} from '@jahia/react-material';
import {useContentEditorContext} from '~/ContentEditor.context';
import {PreviewFetcher} from './Preview.fetcher';
import {getPreviewContext} from '~/EditPanel/EditPanelContent/Preview/Preview.utils';

export const PreviewContainer = ({isDirty, values}) => {
    const {t} = useTranslation();
    const editorContext = useContentEditorContext();
    const [contentNotFound, setContentNotFound] = useState(false);
    const handleContentNotFound = useCallback(() => setContentNotFound(true), []);

    const previewContext = getPreviewContext({path: editorContext.path, lang: editorContext.lang, nodeData: editorContext.nodeData});
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
            </div>
            {!editorContext.nodeData.isFolder &&
                <>
                    <PreviewFetcher values={values} lang={editorContext.lang} nodeData={editorContext.nodeData} previewContext={previewContext} onContentNotFound={handleContentNotFound}/> :
                    <ProgressOverlay/>
                </>}
        </Paper>
    );
};

PreviewContainer.defaultProps = {
    isDirty: false
};

PreviewContainer.propTypes = {
    isDirty: PropTypes.bool,
    values: PropTypes.object.isRequired
};
