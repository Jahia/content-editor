import React from 'react';
import DSContentTable from '../../../../../../../../DesignSystem/ContentTable/ContentTable';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {ContentTableQuery} from './ContentTable.gql-queries';
import dayjs from 'dayjs';

const columConfig = t => [
    {property: 'name', label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.name')},
    {property: 'type', label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.type')},
    {property: 'createdBy', label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.createdBy')},
    {property: 'lastModified', label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.lastModified')}
];

const ContentTableContainer = ({t, setSelectedItem, selectedPath, editorContext}) => {
    let isContent = selectedPath.startsWith('/sites/' + editorContext.site + '/contents');
    const {data, error, loading} = useQuery(ContentTableQuery, {
        variables: {
            path: selectedPath,
            language: editorContext.lang,
            typeFilter: isContent ? ['jnt:content', 'jnt:contentFolder'] : ['jmix:editorialContent', 'jnt:page'],
            recursionTypesFilter: isContent ? ['nt:base'] : ['jnt:page', 'jnt:contentFolder']

        }
    });

    if (error) {
        const message = t('content-editor:label.contentEditor.error.queryingContent', {details: (error.message ? error.message : '')});
        return (<>{message}</>);
    }

    if (loading) {
        return (<ProgressOverlay/>);
    }

    const tableData = data.jcr.result.descendants.nodes.map(content => {
        return {
            id: content.uuid,
            name: content.displayName,
            type: content.primaryNodeType.typeName,
            createdBy: content.createdBy.value,
            lastModified: dayjs(content.lastModified.value).locale(editorContext.lang).format('LLL')
        };
    });
    return (
        <DSContentTable columns={columConfig(t)}
                        labelEmpty={t('content-editor:label.contentEditor.edit.fields.contentPicker.tableEmpty')}
                        data={tableData}
                        order="asc"
                        orderBy="name"
                        error={error}
                        onSelect={setSelectedItem}
        />
    );
};

ContentTableContainer.propTypes = {
    t: PropTypes.func.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    editorContext: PropTypes.object.isRequired
};

export const ContentTable = translate()(ContentTableContainer);
