import React, {useState} from 'react';
import {ErrorBoundary} from '@jahia/jahia-ui-root';
import {useEdit} from './useEdit';
import {useCreate} from './useCreate';
import {FullScreenError} from './FullScreenError';
import {ContentTypeSelectorModal} from './ContentTypeSelectorModal';
import {ContentEditorModal} from './ContentEditorModal';

export const ContentEditorApi = () => {
    const [editorConfig, setEditorConfig] = useState(false);
    const [contentTypeSelectorConfig, setContentTypeSelectorConfig] = useState(false);

    window.CE_API = window.CE_API || {};
    window.CE_API.edit = useEdit(setEditorConfig);
    window.CE_API.create = useCreate(setEditorConfig, setContentTypeSelectorConfig);

    return (
        <ErrorBoundary fallback={<FullScreenError/>}>
            {contentTypeSelectorConfig && (
                <ContentTypeSelectorModal
                    contentTypeSelectorConfig={contentTypeSelectorConfig}
                    setContentTypeSelectorConfig={setContentTypeSelectorConfig}
                    setEditorConfig={setEditorConfig}
                />
            )}

            {editorConfig && (
                <ContentEditorModal
                    editorConfig={editorConfig}
                    setEditorConfig={setEditorConfig}
                />
            )}
        </ErrorBoundary>
    );
};

ContentEditorApi.displayName = 'ContentEditorAPI';
