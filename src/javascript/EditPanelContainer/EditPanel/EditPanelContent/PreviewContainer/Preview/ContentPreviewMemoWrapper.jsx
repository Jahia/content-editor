import React from 'react';
import {ContentPreview} from '@jahia/react-apollo';
import {setPreviewRefetcher} from '../../../../EditPanel.refetches';
import {PreviewComponent} from '@jahia/react-material';
import * as PropTypes from 'prop-types';

export const ContentPreviewMemoWrapper = React.memo(({path, lang, workspace}) => {
    return (
        <ContentPreview path={path}
                        language={lang}
                        workspace={workspace}
                        templateType="html"
                        view="cm"
                        contextConfiguration="preview"
                        fetchPolicy="network-only"
                        setRefetch={refetchingData => setPreviewRefetcher(refetchingData)}
        >
            {data => <PreviewComponent data={data.jcr ? data.jcr : {}} workspace={workspace}/>}
        </ContentPreview>
    );
});

ContentPreviewMemoWrapper.propTypes = {
    path: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    workspace: PropTypes.string.isRequired
};
