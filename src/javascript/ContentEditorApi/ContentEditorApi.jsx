import React, {useEffect, useState} from 'react';
import {ErrorBoundary} from '@jahia/jahia-ui-root';
import {useEdit} from './useEdit';
import {useCreate} from './useCreate';
import {FullScreenError} from './FullScreenError';
import {ContentEditorModal} from './ContentEditorModal';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';
import {ContentTypeSelectorModal} from '~/ContentTypeSelectorModal';

export const ContentEditorApi = () => {
    const [editorConfig, setEditorConfig] = useState(false);
    const [contentTypeSelectorConfig, setContentTypeSelectorConfig] = useState(false);

    let context = useContentEditorApiContext();
    context.edit = useEdit(setEditorConfig);
    context.create = useCreate(setEditorConfig, setContentTypeSelectorConfig);

    window.CE_API = window.CE_API || {};
    window.CE_API.edit = context.edit;
    window.CE_API.create = context.create;

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
                    open
                    childNodeName={contentTypeSelectorConfig.name}
                    nodeTypesTree={contentTypeSelectorConfig.nodeTypesTree}
                    includeSubTypes={contentTypeSelectorConfig.includeSubTypes}
                    parentPath={contentTypeSelectorConfig.path}
                    uilang={contentTypeSelectorConfig.uilang}
                    onClose={() => {
                        setContentTypeSelectorConfig(false);
                    }}
                    onExited={() => {
                        setContentTypeSelectorConfig(false);
                    }}
                    onCreateContent={contentType => {
                        setContentTypeSelectorConfig(false);
                        setEditorConfig({
                            name: contentTypeSelectorConfig.name,
                            uilang: contentTypeSelectorConfig.uilang,
                            contentType: contentType.name,
                            ...contentTypeSelectorConfig.editorConfig
                        });
                    }}
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
