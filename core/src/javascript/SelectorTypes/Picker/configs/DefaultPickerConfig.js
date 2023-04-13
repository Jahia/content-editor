import React from 'react';
import {File, FileBroken} from '@jahia/moonstone';
import {useQuery} from '@apollo/react-hooks';
import {ContentPickerFilledQuery} from './ContentPicker.gql-queries';
import {encodeJCRPath} from '~/utils';
import {useContentEditorContext} from '~/contexts';

const usePickerInputData = uuids => {
    const {lang} = useContentEditorContext();

    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            uuids: uuids || [],
            language: lang
        },
        skip: !uuids,
        errorPolicy: 'ignore'
    });

    if (loading || error || !data || !data.jcr || !uuids || (data.jcr.result.length === 0 && uuids.length > 0)) {
        return {error, loading, notFound: Boolean(uuids)};
    }

    const fieldData = data.jcr.result.map(contentData => ({
        uuid: contentData.uuid,
        path: contentData.path,
        url: encodeJCRPath(`${contentData.primaryNodeType.icon}.png`),
        name: contentData.displayName,
        info: contentData.primaryNodeType.displayName
    }));

    return {fieldData, error, loading};
};

export const DefaultPickerConfig = {
    searchContentType: 'jmix:searchable',
    selectableTypesTable: ['jnt:content', 'jnt:file', 'jnt:page', 'jmix:navMenuItem'],
    showOnlyNodesWithTemplates: false,
    pickerInput: {
        emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalTitle',
        notFoundLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.notFoundContent',
        emptyIcon: <File/>,
        notFoundIcon: <FileBroken/>,
        usePickerInputData
    },
    pickerDialog: {
        view: 'List',
        dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalTitle',
        displayTree: true,
        displaySiteSwitcher: true,
        displaySearch: true
    }
};
