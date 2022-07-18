import React from 'react';
import {FileImage} from '@jahia/moonstone';
import {useQuery} from '@apollo/react-hooks';
import {MediaPickerFilledQuery} from './MediaPicker.gql-queries';
import {encodeJCRPath} from '~/utils';

const usePickerInputData = (uuid, editorContext) => {
    const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
        variables: {
            uuid: uuid || '',
            language: editorContext.lang
        },
        skip: !uuid
    });

    if (loading || error || !data || !uuid) {
        return {error, loading, notFound: Boolean(uuid)};
    }

    const imageData = data.jcr.result;
    const sizeInfo = (imageData.height && imageData.width) ? ` - ${parseInt(imageData.height.value, 10)}x${parseInt(imageData.width.value, 10)}px` : '';
    const fieldData = {
        uuid,
        url: `${
            window.contextJsParameters.contextPath
        }/files/default${encodeJCRPath(imageData.path)}?lastModified=${imageData.lastModified.value}&t=thumbnail2`,
        name: imageData.displayName,
        path: imageData.path,
        info: `${imageData.children.nodes[0].mimeType.value}${sizeInfo}`
    };

    return {fieldData, error, loading};
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
        displayTree: true
    }
};
