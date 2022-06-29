import React from 'react';
import {Picker} from '../Picker';
import {File} from '@jahia/moonstone';
import {useQuery} from '@apollo/react-hooks';
import {ContentPickerFilledQuery} from './ContentPicker.gql-queries';
import {encodeJCRPath} from '~/utils';

const usePickerInputData = (uuid, editorContext) => {
    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            uuid: uuid || '',
            language: editorContext.lang,
            // TODO: BACKLOG-12022 use useLazyQuery here in order to avoid this kind of needToFecth variable
            needToFetch: Boolean(uuid)
        }
    });

    if (loading || error || !data || !data.jcr || !uuid) {
        return {error, loading, notFound: Boolean(uuid)};
    }

    const contentData = data.jcr.result;
    const fieldData = {
        uuid,
        path: contentData.path,
        url: encodeJCRPath(`${contentData.primaryNodeType.icon}.png`),
        name: contentData.displayName,
        info: contentData.primaryNodeType.displayName
    };

    return {fieldData, error, loading};
};

export const ContentPickerSelectorType = {
    cmp: Picker,
    key: 'ContentPicker',
    supportMultiple: false,
    pickerInput: {
        emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addContent',
        notFoundLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.notFoundContent',
        emptyIcon: <File/>,
        usePickerInputData
    },
    PickerDialog: {
        view: 'List',
        dialogTitle: isPickerTypeFiles => isPickerTypeFiles ?
            'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle' :
            'content-editor:label.contentEditor.edit.fields.contentPicker.modalTitle',
        searchPlaceholder: isPickerTypeFiles => isPickerTypeFiles ?
            'content-editor:label.contentEditor.edit.fields.contentPicker.searchFilePlaceholder' :
            'content-editor:label.contentEditor.edit.fields.contentPicker.searchPlaceholder',
        itemSelectionAdapter: content => content ? content.id : null
    }
};
