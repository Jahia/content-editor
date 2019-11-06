import React from 'react';
import DSContentTable from '~/DesignSystem/ContentTable/ContentTable';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {ContentTableQuery} from './ContentTable.gql-queries';
import dayjs from 'dayjs';

const columnConfig = t => [
    {
        property: 'name',
        label: t(
            'content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.name'
        )
    },
    {
        property: 'type',
        label: t(
            'content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.type'
        )
    },
    {
        property: 'createdBy',
        label: t(
            'content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.createdBy'
        )
    },
    {
        property: 'lastModified',
        label: t(
            'content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.lastModified'
        )
    }
];

const ContentTableContainer = ({
    t,
    tableConfig,
    setSelectedItem,
    selectedPath,
    editorContext,
    initialSelection
}) => {
    const {data, error, loading} = useQuery(ContentTableQuery, {
        variables: {
            path: selectedPath,
            language: editorContext.lang,
            typeFilter: tableConfig.typeFilter,
            recursionTypesFilter: tableConfig.recursionTypesFilter,
            fieldFilter: tableConfig.showOnlyNodesWithTemplates ? {filters: [{fieldName: 'isDisplayableNode', evaluation: 'EQUAL', value: 'true'}]} : null
        }
    });

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const tableData = data.jcr.result.descendants.nodes.map(content => {
        return {
            id: content.uuid,
            path: content.path,
            name: content.displayName,
            type: content.primaryNodeType.typeName,
            createdBy: content.createdBy ? content.createdBy.value : undefined,
            lastModified: content.lastModified ? dayjs(content.lastModified.value)
                .locale(editorContext.lang)
                .format('LLL') : undefined
        };
    });
    return (
        <DSContentTable
            columns={columnConfig(t)}
            labelEmpty={t(
                'content-editor:label.contentEditor.edit.fields.contentPicker.tableEmpty'
            )}
            initialSelection={initialSelection}
            data={tableData}
            order="asc"
            orderBy="name"
            error={error}
            onSelect={setSelectedItem}
        />
    );
};

ContentTableContainer.defaultProps = {
    initialSelection: []
};

ContentTableContainer.propTypes = {
    t: PropTypes.func.isRequired,
    tableConfig: PropTypes.shape({
        typeFilter: PropTypes.array.isRequired,
        recursionTypesFilter: PropTypes.array.isRequired,
        showOnlyNodesWithTemplates: PropTypes.bool
    }).isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    editorContext: PropTypes.object.isRequired,
    initialSelection: PropTypes.array
};

export const ContentTable = translate()(ContentTableContainer);
