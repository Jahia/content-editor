import React, {useEffect} from 'react';
import DSContentTable from '~/DesignSystem/ContentTable/ContentTable';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {ContentTableQuery} from './ContentTable.gql-queries';
import dayjs from 'dayjs';
import {registry} from '@jahia/registry';
import {searchPickerQuery} from '../../PickerDialog/Search/search.gql-queries';

const columnConfig = (t, showSubContentsCount) => {
    let columns = [
        {
            property: 'name',
            label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.name')
        },
        {
            property: 'type',
            label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.type')
        },
        {
            property: 'createdBy',
            label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.createdBy')
        },
        {
            property: 'lastModified',
            label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.lastModified')
        }
    ];

    if (showSubContentsCount) {
        columns.splice(1, 0, {
            property: 'subContentsCount',
            label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.subContents')
        });
    }

    return columns;
};

const ContentTableContainer = ({
    t,
    tableConfig,
    setSelectedItem,
    selectedPath,
    editorContext,
    initialSelection,
    searchTerms
}) => {
    const {data, error, loading, refetch} = useQuery(
        searchTerms ? searchPickerQuery : ContentTableQuery,
        {
            variables: {
                path: selectedPath,
                language: editorContext.lang,
                searchTerms,
                searchName: '%' + searchTerms + '%',
                searchSelectorType: tableConfig.searchSelectorType,
                typeFilter: tableConfig.typeFilter,
                recursionTypesFilter: tableConfig.recursionTypesFilter,
                fieldFilter: tableConfig.showOnlyNodesWithTemplates ? {filters: [{fieldName: 'isDisplayableNode', evaluation: 'EQUAL', value: 'true'}]} : null
            }
        });

    useEffect(() => {
        registry.add('refetch-content-list', {
            type: 'refetch-upload',
            refetch: refetch
        });
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

    const nodes = searchTerms ? data.jcr.result.nodes : data.jcr.result.descendants.nodes;

    let showSubContentsCount = false;
    const tableData = nodes.map(content => {
        const haveSubContents = content.primaryNodeType.name !== 'jnt:page' && content.children && content.children.pageInfo.totalCount > 0;
        showSubContentsCount = showSubContentsCount || haveSubContents;

        return {
            id: content.uuid,
            path: content.path,
            name: content.displayName,
            subContentsCount: haveSubContents ? content.children.pageInfo.totalCount : undefined,
            type: content.primaryNodeType.typeName,
            createdBy: content.createdBy ? content.createdBy.value : undefined,
            lastModified: content.lastModified ? dayjs(content.lastModified.value)
                .locale(editorContext.lang)
                .format('LLL') : undefined
        };
    });

    return (
        <DSContentTable
            columns={columnConfig(t, showSubContentsCount)}
            labelEmpty={
                searchTerms ?
                    t('content-editor:label.contentEditor.edit.fields.contentPicker.noSearchResults') :
                    t('content-editor:label.contentEditor.edit.fields.contentPicker.noContent')
            }
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
    initialSelection: [],
    searchTerms: ''
};

ContentTableContainer.propTypes = {
    t: PropTypes.func.isRequired,
    tableConfig: PropTypes.shape({
        typeFilter: PropTypes.array.isRequired,
        searchSelectorType: PropTypes.string.isRequired,
        recursionTypesFilter: PropTypes.array.isRequired,
        showOnlyNodesWithTemplates: PropTypes.bool
    }).isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    editorContext: PropTypes.object.isRequired,
    initialSelection: PropTypes.array,
    searchTerms: PropTypes.string
};

export const ContentTable = translate()(ContentTableContainer);
