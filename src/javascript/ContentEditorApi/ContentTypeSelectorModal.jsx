import {CreateNewContentDialog} from '~/actions/jcontent/createContent/CreateNewContentDialog';
import {Constants} from '~/ContentEditor.constants';
import React from 'react';
import PropTypes from 'prop-types';

export const ContentTypeSelectorModal = ({
    contentTypeSelectorConfig,
    setContentTypeSelectorConfig,
    setEditorConfig
}) => {
    return (
        <CreateNewContentDialog
            open
            childNodeName={contentTypeSelectorConfig.name}
            nodeTypes={contentTypeSelectorConfig.creatableNodeTypes}
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
                    uuid: contentTypeSelectorConfig.uuid,
                    site: contentTypeSelectorConfig.site,
                    uilang: contentTypeSelectorConfig.uilang,
                    initLang: contentTypeSelectorConfig.lang,
                    lang: contentTypeSelectorConfig.lang,
                    isFullscreen: contentTypeSelectorConfig.isFullscreen,
                    contentType: contentType.name,
                    mode: Constants.routes.baseCreateRoute,
                    createCallback: contentTypeSelectorConfig.createCallback,
                    onClosedCallback: contentTypeSelectorConfig.onClosedCallback

                });
            }}
        />
    );
};

ContentTypeSelectorModal.propTypes = {
    contentTypeSelectorConfig: PropTypes.object.isRequired,
    setContentTypeSelectorConfig: PropTypes.func.isRequired,
    setEditorConfig: PropTypes.func.isRequired
};
