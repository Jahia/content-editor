import React from 'react';
import {Picker} from '../picker';
import {pickerActions} from '../actions';
import {InsertDriveFile} from '@material-ui/icons';
import {encodeJCRPath} from '~/EditPanel/EditPanel.utils';
import {useQuery} from 'react-apollo-hooks';
import {ContentPickerFilledQuery} from './ContentPicker.gql-queries';

import {ContentTable} from './ContentTable';

const usePickerInputData = (uuid, editorContext) => {
    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            uuid: uuid,
            language: editorContext.lang,
            // TODO: BACKLOG-12022 use useLazyQuery here in order to avoid this kind of needToFecth variable
            needToFetch: Boolean(uuid)
        }
    });

    if (loading || error || !uuid) {
        return {error, loading};
    }

    const contentData = data.jcr.result;
    const fieldData = {
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
    actions: pickerActions,
    supportMultiple: false,
    pickerInput: {
        emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addContent',
        emptyIcon: <InsertDriveFile/>,
        usePickerInputData
    },
    PickerDialog: {
        DialogContent: ContentTable,
        dialogTitle: isPickerTypeFiles => isPickerTypeFiles ?
            'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle' :
            'content-editor:label.contentEditor.edit.fields.contentPicker.modalTitle',
        searchPlaceholder: isPickerTypeFiles => isPickerTypeFiles ?
            'content-editor:label.contentEditor.edit.fields.contentPicker.searchFilePlaceholder' :
            'content-editor:label.contentEditor.edit.fields.contentPicker.searchPlaceholder',
        itemSelectionAdapter: content => content[0] ? content[0].id : null
    }
};
