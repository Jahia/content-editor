import React, {useState, useEffect} from 'react';
import {useContentPreview} from '@jahia/data-helper';
import {useContentEditorContext} from '~/ContentEditor.context';
import {setPreviewRefetcher} from '~/EditPanel/EditPanel.refetches';
import {PreviewComponent} from '@jahia/react-material';
import {Badge} from '@jahia/design-system-kit';
import {getPreviewContext, removeSiblings} from './Preview.utils';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';

const styles = theme => ({
    previewContainer: {
        padding: 0
    },
    badges: {
        marginTop: -(theme.spacing.unit * 2),
        marginBottom: theme.spacing.unit
    }
});

const ContentPreviewMemoWrapperCmp = React.memo(({classes}) => {
    const {t} = useTranslation();
    const editorContext = useContentEditorContext();
    const [contentNoFound, setContentNotFound] = useState(false);

    const previewContext = getPreviewContext(editorContext);
    const {data, loading, error, refetch} = useContentPreview({
        ...previewContext,
        fetchPolicy: 'network-only',
        setRefetch: refetchingData => setPreviewRefetcher(refetchingData)
    });

    useEffect(() => {
        setPreviewRefetcher({
            queryParams: {
                language: editorContext.lang,
                path: editorContext.path
            },
            refetch
        });
    }, [editorContext.lang, editorContext.path, refetch]);

    // No preview for folders
    if (editorContext.nodeData.isFolder) {
        return (
            <div className={classes.badges}>
                <Badge
                    badgeContent={t('content-editor:label.contentEditor.preview.noPreview')}
                    variant="normal"
                    color="warning"
                />
            </div>
        );
    }

    const domLoadedCallback = frameDoc => {
        // No zoom on full if no content wrapped in the page
        if (!previewContext.requestAttributes) {
            return;
        }

        const contentPreview = frameDoc.getElementById('ce_preview_content');
        if (contentPreview) {
            removeSiblings(contentPreview);
        } else {
            setContentNotFound(true);
        }
    };

    if (error) {
        const message = t(
            'content-media-manager:label.contentManager.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    return (
        <>
            {contentNoFound &&
            <div className={classes.badges}>
                <Badge
                    badgeContent={t('content-editor:label.contentEditor.preview.contentNotFound')}
                    variant="normal"
                    color="warning"
                />
            </div>}

            <PreviewComponent
                classes={{previewContainer: classes.previewContainer}}
                data={data.jcr ? data.jcr : {}}
                workspace={previewContext.workspace}
                domLoadedCallback={domLoadedCallback}
                iFrameStyle="pointer-events: none"
                iframeProps={{
                    'aria-labelledby': 'preview-tab'
                }}
            />
        </>
    );
});

ContentPreviewMemoWrapperCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const ContentPreviewMemoWrapper = withStyles(styles)(ContentPreviewMemoWrapperCmp);
ContentPreviewMemoWrapper.displayName = 'ContentPreviewMemoWrapper';
