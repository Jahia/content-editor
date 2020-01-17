import React, {useEffect} from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {ImageList} from '~/DesignSystem/ImageList';
import {encodeJCRPath} from '~/EditPanel/EditPanel.utils';
import {registry} from '@jahia/registry';
import {useDialogPickerContent} from '../useDialogPickerContent';

export const Thumbnail = ({
    setSelectedItem,
    onThumbnailDoubleClick,
    selectedPath,
    initialSelection,
    searchTerms,
    pickerConfig
}) => {
    const {t} = useTranslation();
    const {nodes, error, loading, refetch} = useDialogPickerContent(pickerConfig, selectedPath, searchTerms);

    useEffect(() => {
        registry.add('refetch-image-list', {
            type: 'refetch-upload',
            refetch: refetch
        });
    });

    if (error) {
        const message = t(
            'content-media-manager:label.contentManager.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const images = nodes.map(rawImg => {
        return {
            uuid: rawImg.uuid,
            url: `${
                window.contextJsParameters.contextPath
            }/files/default${encodeJCRPath(rawImg.path)}?lastModified=${rawImg.lastModified.value}&t=thumbnail2`,
            path: rawImg.path,
            name: rawImg.displayName,
            type: rawImg.metadata.nodes[0].mimeType.value.replace('image/', ''),
            width: rawImg.width ? `${rawImg.width.value}` : null,
            height: rawImg.height ? `${rawImg.height.value}` : null
        };
    });

    return (
        <ImageList
            labelEmpty={
                searchTerms ?
                    t('content-editor:label.contentEditor.edit.fields.contentPicker.noSearchResults') :
                    t('content-editor:label.contentEditor.edit.fields.contentPicker.noContent')
            }
            images={images}
            error={error}
            initialSelection={initialSelection}
            onImageSelection={setSelectedItem}
            onImageDoubleClick={onThumbnailDoubleClick}
        />
    );
};

Thumbnail.defaultProps = {
    initialSelection: null,
    searchTerms: ''
};

Thumbnail.propTypes = {
    setSelectedItem: PropTypes.func.isRequired,
    onThumbnailDoubleClick: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    initialSelection: PropTypes.array,
    searchTerms: PropTypes.string
};
