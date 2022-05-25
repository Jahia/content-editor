import React, {useState, useEffect} from 'react';
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

    const editorConfigDefined = Boolean(editorConfig);
    const editorConfigLang = editorConfig.lang;
    useEffect(() => {
        if (editorConfigDefined) {
            // Sync GWT language
            window.overrideLang = editorConfigLang;
            window.previousLang = window.jahiaGWTParameters.lang;
            if (window.authoringApi.switchLanguage) {
                window.authoringApi.switchLanguage(editorConfigLang);
            }
        }

        return () => {
            delete window.overrideLang;
            if (window.authoringApi.switchLanguage && window.previousLang) {
                window.authoringApi.switchLanguage(window.previousLang);
            }
        };
    }, [editorConfigDefined, editorConfigLang]);

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
