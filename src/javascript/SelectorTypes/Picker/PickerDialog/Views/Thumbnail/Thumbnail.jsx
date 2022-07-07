import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useNotifications} from '@jahia/react-material';
import {useTranslation} from 'react-i18next';
import {ImageList} from '~/DesignSystem/ImageList';
import {registry} from '@jahia/ui-extender';
import {useDialogPickerContent} from '../useDialogPickerContent';
import {CountDisplayer} from '../CountDisplayer';
import {notifyAccessDenied} from '../ErrorHandler';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {encodeJCRPath} from '~/utils';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';

export const Thumbnail = ({
    setSelectedItem,
    onThumbnailDoubleClick,
    selectedPath,
    initialSelection,
    searchTerms,
    pickerConfig,
    lang
}) => {
    const notificationContext = useNotifications();
    const {t} = useTranslation('content-editor');
    const {
        nodes,
        totalCount,
        hasMore,
        error,
        loading,
        refetch,
        loadMore
    } = useDialogPickerContent({
        lang,
        pickerConfig,
        selectedPath,
        searchTerms,
        fieldSorter: {
            fieldName: 'lastModified.value',
            sortType: 'DESC'
        }
    });

    useEffect(() => {
        registry.addOrReplace('refetch-upload', 'refetch-image-list', {
            refetch
        });
        return () => {
            registry.remove('refetch-upload', 'refetch-image-list');
        };
    }, [refetch]);

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        console.warn(message);
        notifyAccessDenied(error, notificationContext, t);
    }

    if (loading || !nodes) {
        return <LoaderOverlay/>;
    }

    const images = error ?
        [] :
        nodes.map(rawImg => {
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
        <>
            <CountDisplayer totalCount={totalCount}/>
            <ImageList
                labelEmpty={
                    searchTerms ?
                        t('content-editor:label.contentEditor.edit.fields.contentPicker.noSearchResults') :
                        t('content-editor:label.contentEditor.edit.fields.contentPicker.noContent')
                }
                images={images}
                hasMore={hasMore}
                loadMore={loadMore}
                error={error}
                initialSelection={initialSelection}
                onImageSelection={setSelectedItem}
                onImageDoubleClick={onThumbnailDoubleClick}
            />
        </>
    );
};

Thumbnail.defaultProps = {
    initialSelection: null,
    searchTerms: ''
};

Thumbnail.propTypes = {
    lang: PropTypes.string.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    onThumbnailDoubleClick: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    pickerConfig: configPropType.isRequired,
    initialSelection: PropTypes.array,
    searchTerms: PropTypes.string
};

