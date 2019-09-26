import React, {useState} from 'react';
import {ContentPreview} from '@jahia/react-apollo';
import {useContentEditorContext} from '~/ContentEditor.context';
import {setPreviewRefetcher} from '~/EditPanelContainer/EditPanel.refetches';
import {PreviewComponent} from '@jahia/react-material';
import {Badge} from '@jahia/design-system-kit';
import {getPreviewContext, removeSiblings} from './Preview.utils';
import * as PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';

const styles = theme => ({
    previewContainer: {
        padding: 0
    },
    contentIframe: {
        pointerEvents: 'none',
        cursor: 'default'
    },
    badges: {
        marginTop: -(theme.spacing.unit * 2),
        marginBottom: theme.spacing.unit
    }
});

export const ContentPreviewMemoWrapperCmp = React.memo(({t, classes}) => {
    const editorContext = useContentEditorContext();
    const previewContext = getPreviewContext(editorContext);
    const [contentNoFound, setContentNotFound] = useState(false);

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

    return (
        <>
            {contentNoFound &&
            <div className={classes.badges}>
                <Badge
                    badgeContent={t('content-editor:label.contentEditor.preview.contentNotFound')}
                    variant="normal"
                    color="warning"
                />
            </div>
            }

            <ContentPreview {...previewContext}
                            fetchPolicy="network-only"
                            setRefetch={refetchingData => setPreviewRefetcher(refetchingData)}
            >
                {data => {
                    return (
                        <PreviewComponent classes={{previewContainer: classes.previewContainer, contentIframe: classes.contentIframe}}
                                          data={data.jcr ? data.jcr : {}}
                                          workspace={previewContext.workspace}
                                          domLoadedCallback={domLoadedCallback}
                                          />
                    );
                }}
            </ContentPreview>
        </>
    );
});

ContentPreviewMemoWrapperCmp.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

export const ContentPreviewMemoWrapper = compose(
    translate(),
    withStyles(styles)
)(ContentPreviewMemoWrapperCmp);
