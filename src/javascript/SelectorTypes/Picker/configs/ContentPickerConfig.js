import React from 'react';
<<<<<<< HEAD:src/javascript/SelectorTypes/Picker/configs/ContentPickerConfig.js
=======
import {Picker} from '../Picker';
import {Picker2} from '../Picker2';
>>>>>>> BACKLOG-17222 Initial setup for picker:src/javascript/SelectorTypes/Picker/ContentPicker/ContentPickerSelectorType.js
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

<<<<<<< HEAD:src/javascript/SelectorTypes/Picker/configs/ContentPickerConfig.js
export const ContentPickerConfig = {
=======
export const ContentPickerSelectorType = {
    cmp: Picker2,
    key: 'ContentPicker',
    supportMultiple: false,
>>>>>>> BACKLOG-17222 Initial setup for picker:src/javascript/SelectorTypes/Picker/ContentPicker/ContentPickerSelectorType.js
    pickerInput: {
        emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addContent',
        notFoundLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.notFoundContent',
        emptyIcon: <File/>,
        usePickerInputData,
        displayTree: true
    },
    PickerDialog: {
        view: 'List',
        dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalTitle',
        searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchPlaceholder',
        itemSelectionAdapter: content => content ? content.id : null,
        displayTree: true
    }
};
