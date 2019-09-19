import React from 'react';
import {ContentPreview} from '@jahia/react-apollo';
import {setPreviewRefetcher} from '../../../../EditPanel.refetches';
import {PreviewComponent} from '@jahia/react-material';
import {useContentEditorContext} from '../../../../../ContentEditor.context';
import {getPreviewContext} from './Preview.utils';

export const ContentPreviewMemoWrapper = React.memo(() => {
    const editorContext = useContentEditorContext();
    const previewContext = getPreviewContext(editorContext);

    return (
        <ContentPreview {...previewContext}
                        fetchPolicy="network-only"
                        setRefetch={refetchingData => setPreviewRefetcher(refetchingData)}
        >
            {data => <PreviewComponent data={data.jcr ? data.jcr : {}} workspace={previewContext.workspace}/>}
        </ContentPreview>
    );
});
