import React from 'react';
import {ContentPreview} from '@jahia/react-apollo';
import {setPreviewRefetcher} from '../../../../EditPanel.refetches';
import {PreviewComponent} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';

const styles = () => ({
    previewContainer: {
        padding: 0
    }
});

const ContentPreviewMemoWrapperCmp = React.memo(({classes, path, lang, workspace}) => {
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
            {data => (
                <PreviewComponent classes={{previewContainer: classes.previewContainer}}
                                  data={data.jcr ? data.jcr : {}}
                                  workspace={workspace}/>
)}
        </ContentPreview>
    );
});

export const ContentPreviewMemoWrapper = compose(
    withStyles(styles)
)(ContentPreviewMemoWrapperCmp);

ContentPreviewMemoWrapperCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    workspace: PropTypes.string.isRequired
};
