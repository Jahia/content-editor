import React, {useEffect} from 'react';
import DSContentTable from '~/DesignSystem/ContentTable/ContentTable';
import {useQuery} from 'react-apollo-hooks';
import {useTranslation} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {ContentTableQuery} from './ContentTable.gql-queries';
import dayjs from 'dayjs';
import {registry} from '@jahia/registry';
import {searchPickerQuery} from '../../PickerDialog/Search/search.gql-queries';
import ContentTableCellBadgeRenderer from './ContentTableCellBadgeRenderer';
import {NavigateInto} from './NavigateInto';
import {Typography} from '@jahia/design-system-kit';
import {withStyles} from '@material-ui/core';

const styles = () => ({
    itemsFoundLabel: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

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
            label: t('content-editor:label.contentEditor.edit.fields.contentPicker.tableHeader.subContents'),
            renderer: ContentTableCellBadgeRenderer
        });

        columns.push({
            property: 'navigateInto',
            label: '',
            renderer: NavigateInto
        });
    }

    return columns;
};

const ContentTableCmp = ({
    classes,
    tableConfig,
    setSelectedItem,
    selectedPath,
    setSelectedPath,
    editorContext,
    initialSelection,
    searchTerms
}) => {
    const {t} = useTranslation();
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
                fieldFilter: tableConfig.showOnlyNodesWithTemplates ? {
                    filters: [{
                        fieldName: 'isDisplayableNode',
                        evaluation: 'EQUAL',
                        value: 'true'
                    }]
                } : null
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
        const haveSubContents = content.primaryNodeType.name !== 'jnt:page' && content.children &&
            content.children.pageInfo && content.children.pageInfo.totalCount > 0;
        showSubContentsCount = showSubContentsCount || haveSubContents;

        return {
            id: content.uuid,
            path: content.path,
            name: content.displayName,
            subContentsCount: haveSubContents ? content.children.pageInfo.totalCount : undefined,
            type: content.primaryNodeType.typeName,
            createdBy: content.createdBy ? content.createdBy.value : undefined,
            lastModified: content.lastModified ? dayjs(content.lastModified.value)
                .locale(editorContext.uiLang)
                .format('LLL') : undefined,
            navigateInto: haveSubContents,
            props: {
                navigateInto: {
                    onClick: e => {
                        e.preventDefault();
                        setSelectedPath(content.path);
                    }
                }
            }
        };
    });

    const totalCount = searchTerms ?
        data.jcr.retrieveTotalCount.pageInfo.totalCount :
        data.jcr.result.retrieveTotalCount.pageInfo.totalCount;

    return (
        <>
            <div className={classes.itemsFoundLabel}>
                <Typography color="gamma" variant="omega">
                    {t('content-editor:label.contentEditor.edit.fields.contentPicker.itemsFound', {totalCount: totalCount})}
                </Typography>
            </div>

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
        </>
    );
};

ContentTableCmp.defaultProps = {
    initialSelection: [],
    searchTerms: ''
};

ContentTableCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    tableConfig: PropTypes.shape({
        typeFilter: PropTypes.array.isRequired,
        searchSelectorType: PropTypes.string.isRequired,
        recursionTypesFilter: PropTypes.array.isRequired,
        showOnlyNodesWithTemplates: PropTypes.bool
    }).isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    setSelectedPath: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    initialSelection: PropTypes.array,
    searchTerms: PropTypes.string
};

export const ContentTable = withStyles(styles)(ContentTableCmp);
ContentTable.displayName = 'ContentTable';
