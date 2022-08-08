import React from 'react';
import {Collections, File, Folder, SiteWeb} from '@jahia/moonstone';
import {useQuery} from '@apollo/react-hooks';
import {ContentPickerFilledQuery} from './ContentPicker.gql-queries';
import {encodeJCRPath} from '~/utils';
import {useContentEditorContext} from '~/contexts';
import {shallowEqual, useSelector} from 'react-redux';

const usePickerInputData = uuids => {
    const {lang} = useContentEditorContext();

    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            uuids: uuids || [],
            language: lang
        },
        skip: !uuids
    });

    if (loading || error || !data || !data.jcr || !uuids) {
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

const getSearchContextOptions = (currentPath, currentSite) => {
    return [
        {
            label: 'Folder',
            value: currentPath,
            iconStart: <Folder/>
        },
        {
            label: 'Content',
            value: `${currentSite}/contents`,
            iconStart: <Collections/>
        },
        {
            label: currentSite.substring(0, 1).toUpperCase() + currentSite.substring(1),
            value: `/sites/${currentSite}`,
            iconStart: <SiteWeb/>
        }
    ];
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
        displayTree: true,
        displaySiteSwitcher: true,
        displaySearch: true,
        displaySearchContext: true,
        searchContextOptions: getSearchContextOptions
    }
};
