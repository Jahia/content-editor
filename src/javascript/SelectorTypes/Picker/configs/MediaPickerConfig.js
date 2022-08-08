import React from 'react';
import {Collections, FileImage, Folder, SiteWeb} from '@jahia/moonstone';
import {useQuery} from '@apollo/react-hooks';
import {MediaPickerFilledQuery} from './MediaPicker.gql-queries';
import {encodeJCRPath} from '~/utils';
import {useContentEditorContext} from '~/contexts';

const usePickerInputData = uuids => {
    const {lang} = useContentEditorContext();

    const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
        variables: {
            uuids: uuids || [],
            language: lang
        },
        skip: !uuids
    });

    if (loading || error || !data || !uuids) {
        return {error, loading, notFound: Boolean(uuids)};
    }

    const fieldData = data.jcr.result.map(imageData => {
        const sizeInfo = (imageData.height && imageData.width) ? ` - ${parseInt(imageData.height.value, 10)}x${parseInt(imageData.width.value, 10)}px` : '';
        return {
            uuid: imageData.uuid,
            url: `${
                window.contextJsParameters.contextPath
            }/files/default${encodeJCRPath(imageData.path)}?lastModified=${imageData.lastModified.value}&t=thumbnail2`,
            name: imageData.displayName,
            path: imageData.path,
            info: `${imageData.children.nodes[0].mimeType.value}${sizeInfo}`
        };
    });

    return {fieldData, error, loading};
};

const getSearchContextOptions = (currentPath, currentSite, t) => {
    return [
        {
            label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.folder'),
            value: currentPath,
            iconStart: <Folder/>
        },
        {
            label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.medias'),
            value: `/sites/${currentSite}/files`,
            iconStart: <Collections/>
        },
        {
            label: currentSite.substring(0, 1).toUpperCase() + currentSite.substring(1),
            value: `/sites/${currentSite}`,
            iconStart: <SiteWeb/>
        }
    ];
};

export const MediaPickerConfig = {
    pickerInput: {
        emptyLabel: 'content-editor:label.contentEditor.edit.fields.imagePicker.emptyInputLabel',
        notFoundLabel: 'content-editor:label.contentEditor.edit.fields.imagePicker.notFoundImage',
        emptyIcon: <FileImage/>,
        usePickerInputData
    },
    pickerDialog: {
        view: 'Thumbnail',
        dialogTitle: 'content-editor:label.contentEditor.edit.fields.imagePicker.modalTitle',
        searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.imagePicker.searchPlaceholder',
        displayTree: true,
        displaySiteSwitcher: true,
        displaySearch: true,
        displaySearchContext: true,
        searchContextOptions: getSearchContextOptions
    }
};
