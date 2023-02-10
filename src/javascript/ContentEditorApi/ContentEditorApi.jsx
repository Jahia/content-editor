import React, {useEffect, useRef, useState} from 'react';
import {ErrorBoundary} from '@jahia/jahia-ui-root';
import {useEdit} from './useEdit';
import {useCreate} from './useCreate';
import {FullScreenError} from './FullScreenError';
import {ContentEditorModal} from './ContentEditorModal';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';
import {ContentTypeSelectorModal} from '~/ContentTypeSelectorModal';
import {Constants} from '~/ContentEditor.constants';
import {useHistory, useLocation} from 'react-router-dom';
import rison from 'rison';

export const ContentEditorApi = () => {
    const [editorConfigs, setEditorConfigs] = useState([]);
    const [contentTypeSelectorConfig, setContentTypeSelectorConfig] = useState(false);

    let newEditorConfig = editorConfig => {
        if (!editorConfig.formKey) {
            editorConfig.formKey = 'modal_' + editorConfigs.length;
        }

        setEditorConfigs([...editorConfigs, editorConfig]);
    };

    let updateEditorConfig = (editorConfig, index) => {
        let copy = Array.from(editorConfigs);
        copy[index] = editorConfig;
        setEditorConfigs(copy);
    };

    let deleteEditorConfig = index => {
        let copy = Array.from(editorConfigs);
        copy.splice(index, 1);
        setEditorConfigs(copy);
    };

    let context = useContentEditorApiContext();
    context.edit = useEdit(newEditorConfig);
    context.create = useCreate(newEditorConfig, setContentTypeSelectorConfig);

    window.CE_API = window.CE_API || {};
    window.CE_API.edit = context.edit;
    window.CE_API.create = context.create;

    const history = useHistory();
    const location = useLocation();
    const first = useRef();

    useEffect(() => {
        let values = {};
        try {
            values = location.hash ? rison.decode(location.hash.substring(1)) : {};
        } catch {
            //
        }

        const {contentEditor, ...others} = values;
        if (contentEditor && !first.current) {
            setEditorConfigs(contentEditor);
        } else {
            const valid = editorConfigs.every(config => Object.values(config).every(o => typeof o !== 'function'));

            if (contentEditor && (!valid || editorConfigs.length === 0)) {
                history.replace({hash: Object.keys(others).length > 0 ? rison.encode_uri(others) : null});
            } else if (valid && editorConfigs.length > 0) {
                const hash = '#' + rison.encode_uri({...others, contentEditor: editorConfigs});
                if (location.hash !== hash) {
                    history.replace({hash});
                }
            }
        }

        first.current = true;
    }, [editorConfigs, location.hash, history, context.edit]);

    const editorConfigLang = editorConfigs.length > 0 ? editorConfigs[0].lang : undefined;
    useEffect(() => {
        if (editorConfigLang) {
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
    }, [editorConfigLang]);

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
                        newEditorConfig({
                            name: contentTypeSelectorConfig.name,
                            uilang: contentTypeSelectorConfig.uilang,
                            contentType: contentType.name,
                            mode: Constants.routes.baseCreateRoute,
                            ...contentTypeSelectorConfig.editorConfig
                        });
                    }}
                />
            )}

            {editorConfigs.map((editorConfig, index) => {
                return (
                    <ContentEditorModal
                        key={editorConfig.mode + '_' + editorConfig.uuid} // TODO: best effort to have a unique KEY for modals (definitely we need control to allow or not open same modal or multiple create at the same time.)
                        editorConfig={editorConfig}
                        updateEditorConfig={updatedEditorConfig => {
                            updateEditorConfig(updatedEditorConfig, index);
                        }}
                        deleteEditorConfig={() => {
                            deleteEditorConfig(index);
                        }}
                    />
                );
            })}
        </ErrorBoundary>
    );
};
