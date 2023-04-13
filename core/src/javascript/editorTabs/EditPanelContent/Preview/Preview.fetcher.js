import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useContentPreview} from '@jahia/data-helper';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {invalidateRefetch, setPreviewRefetcher} from '~/ContentEditor/EditPanel/EditPanel.refetches';
import {PreviewViewer} from './PreviewViewers';
import {getPreviewContext} from './Preview.utils';
import {useTranslation} from 'react-i18next';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

export const PreviewFetcher = React.memo(({onContentNotFound}) => {
    const {t} = useTranslation('content-editor');
    const editorContext = useContentEditorContext();

    const previewContext = getPreviewContext(editorContext);
    const {data, loading, error, refetch} = useContentPreview({
        ...previewContext,
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        setPreviewRefetcher({
            queryParams: {
                language: editorContext.lang,
                path: previewContext.path
            },
            refetch
        });
        return () => {
            invalidateRefetch({
                language: editorContext.lang,
                path: previewContext.path
            });
        };
    }, [editorContext.lang, previewContext.path, refetch]);

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <LoaderOverlay/>;
    }

    return (
        <PreviewViewer
            data={data.jcr ? data.jcr : {}}
            previewContext={previewContext}
            onContentNotFound={onContentNotFound}
        />
    );
});

PreviewFetcher.propTypes = {
    onContentNotFound: PropTypes.func.isRequired
};
