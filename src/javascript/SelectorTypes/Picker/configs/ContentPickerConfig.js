import React from 'react';
import {File} from '@jahia/moonstone';
import {useQuery} from '@apollo/react-hooks';
import {ContentPickerFilledQuery} from './ContentPicker.gql-queries';
import {encodeJCRPath} from '~/utils';

const usePickerInputData = (path, editorContext) => {
    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            path: path || '',
            language: editorContext.lang
        },
        skip: !path
    });

    if (loading || error || !data || !data.jcr || !path) {
        return {error, loading, notFound: Boolean(path)};
    }

    const contentData = data.jcr.result;
    const fieldData = {
        uuid: contentData.uuid,
        path: contentData.path,
        url: encodeJCRPath(`${contentData.primaryNodeType.icon}.png`),
        name: contentData.displayName,
        info: contentData.primaryNodeType.displayName
    };

    return {fieldData, error, loading};
};

export const ContentPickerConfig = {
    pickerInput: {
        emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addContent',
        notFoundLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.notFoundContent',
        emptyIcon: <File/>,
        usePickerInputData
    },
    pickerDialog: {
        view: 'List',
        dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalTitle',
        searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchPlaceholder',
        displayTree: true
    }
};
