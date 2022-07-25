import {CreateNewContentDialog} from '~/actions/jcontent/createContent/CreateNewContentDialog';
import React from 'react';
import PropTypes from 'prop-types';

export const ContentTypeSelectorModal = ({
    contentTypeSelectorConfig,
    setContentTypeSelectorConfig,
    setEditorConfig
}) => {
    const {creatableNodeTypes, includeSubTypes, name, path, uilang, ...editorConfig} = contentTypeSelectorConfig;

    return (
        <CreateNewContentDialog
            open
            childNodeName={name}
            nodeTypes={creatableNodeTypes}
            includeSubTypes={includeSubTypes}
            parentPath={path}
            uilang={uilang}
            onClose={() => {
                setContentTypeSelectorConfig(false);
            }}
            onExited={() => {
                setContentTypeSelectorConfig(false);
            }}
            onCreateContent={contentType => {
                setContentTypeSelectorConfig(false);
                setEditorConfig({
                    name: name,
                    uilang: uilang,
                    contentType: contentType.name,
                    ...editorConfig
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
