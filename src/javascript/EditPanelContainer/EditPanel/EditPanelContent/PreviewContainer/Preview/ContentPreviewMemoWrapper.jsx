import React from 'react';
import {ContentPreview} from '@jahia/react-apollo';
import {setPreviewRefetcher} from '../../../../EditPanel.refetches';
import {PreviewComponent} from '@jahia/react-material';
import {useContentEditorContext} from '../../../../../ContentEditor.context';
import {getPreviewContext, removeSiblings} from './Preview.utils';

export const ContentPreviewMemoWrapper = React.memo(() => {
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
            {data => <PreviewComponent data={data.jcr ? data.jcr : {}} workspace={previewContext.workspace} domLoadedCallback={domLoadedCallback}/>}
        </ContentPreview>
    );
});
