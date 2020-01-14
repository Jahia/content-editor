import React from 'react';
import {Picker} from '../PickerContainer';
import {Image} from '@material-ui/icons';
import {encodeJCRPath} from '~/EditPanel/EditPanel.utils';
import {useQuery} from 'react-apollo-hooks';
import {MediaPickerFilledQuery} from './MediaPicker.gql-queries';
import {ImageListQuery} from './ImageListQuery';

const usePickerInputData = uuid => {
    const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
        variables: {
            uuid: uuid || '',
            // TODO: BACKLOG-12022 use useLazyQuery here in order to avoid this kind of needToFecth variable
            needToFetch: Boolean(uuid)
        }
    });

    if (loading || error || !uuid) {
        return {error, loading};
    }

    const imageData = data.jcr.result;
    const sizeInfo = (imageData.height && imageData.width) ? ` - ${parseInt(imageData.height.value, 10)}x${parseInt(imageData.width.value, 10)}px` : '';
    const fieldData = {
        url: `${
            window.contextJsParameters.contextPath
        }/files/default${encodeJCRPath(imageData.path)}?lastModified=${imageData.lastModified.value}`,
        name: imageData.name,
        path: imageData.path,
        info: `${imageData.children.nodes[0].mimeType.value}${sizeInfo}`
    };

    return {fieldData, error, loading};
};

export const MediaPickerSelectorType = {
    cmp: Picker,
    key: 'MediaPicker',
    supportMultiple: false,
    pickerInput: {
        emptyLabel: 'content-editor:label.contentEditor.edit.fields.imagePicker.addImage',
        emptyIcon: <Image/>,
        usePickerInputData
    },
    PickerDialog: {
        DialogContent: ImageListQuery,
        dialogTitle: () => 'content-editor:label.contentEditor.edit.fields.imagePicker.modalTitle',
        searchPlaceholder: () => 'content-editor:label.contentEditor.edit.fields.imagePicker.searchPlaceholder',
        itemSelectionAdapter: image => image ? image.uuid : null
    }
};
