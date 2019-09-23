import React from 'react';
import {ContentPreview} from '@jahia/react-apollo';
import {useContentEditorContext} from '../../../../../ContentEditor.context';
import {setPreviewRefetcher} from '../../../../EditPanel.refetches';
import {PreviewComponent} from '@jahia/react-material';
import {getPreviewContext, removeSiblings} from './Preview.utils';
import * as PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';

const styles = () => ({
    previewContainer: {
        padding: 0
    }
});

export const ContentPreviewMemoWrapperCmp = React.memo(({classes}) => {
    const editorContext = useContentEditorContext();
    const previewContext = getPreviewContext(editorContext);

    const domLoadedCallback = frameDoc => {
        // No zoom on full if no content wrapped in the page
        if (!previewContext.requestAttributes) {
            return;
        }

        const contentPreview = frameDoc.getElementById('ce_preview_content');
        if (contentPreview) {
            removeSiblings(contentPreview);
        } else {
            // Todo display badge content not found
        }
    };

    return (
        <ContentPreview {...previewContext}
                        fetchPolicy="network-only"
                        setRefetch={refetchingData => setPreviewRefetcher(refetchingData)}
        >
            {data => (
                <PreviewComponent classes={{previewContainer: classes.previewContainer}}
                                  data={data.jcr ? data.jcr : {}}
                                  workspace={previewContext.workspace}
                                  domLoadedCallback={domLoadedCallback}
                />
            )}
        </ContentPreview>
    );
});

ContentPreviewMemoWrapperCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const ContentPreviewMemoWrapper = compose(
    withStyles(styles)
)(ContentPreviewMemoWrapperCmp);
