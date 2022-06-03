import React, {useEffect, useState} from 'react';
import {ContentTable} from '~/DesignSystem/ContentTable/ContentTable';
import {useTranslation} from 'react-i18next';
import {useNotifications} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {useDialogPickerContent} from '../useDialogPickerContent';
import dayjs from 'dayjs';
import {registry} from '@jahia/ui-extender';
import ContentTableCellBadgeRenderer from './ContentTableCellBadgeRenderer';
import {NavigateInto} from './NavigateInto';
import {CountDisplayer} from '../CountDisplayer';
import {notifyAccessDenied} from '../ErrorHandler';
import SubContentCountLazyLoader from './SubContentCountLazyLoader';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

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

const columnIdFieldNameMapper = {
    name: 'displayName',
    subContentsCount: 'children.pageInfo.totalCount',
    type: 'primaryNodeType.typeName',
    createdBy: 'createdBy.value',
    lastModified: 'lastModified.value'
};

export const List = ({
    pickerConfig,
    setSelectedItem,
    selectedPath,
    setSelectedPath,
    lang,
    uilang,
    initialSelection,
    searchTerms
}) => {
    const notificationContext = useNotifications();
    const {t} = useTranslation('content-editor');
    const [sort, setSort] = useState({
        order: 'DESC',
        fieldName: columnIdFieldNameMapper.lastModified,
        columnId: 'lastModified'
    });
    const handleSort = column => {
        setSort({
            order: sort.columnId === column.property && sort.order === 'DESC' ? 'ASC' : 'DESC',
            columnId: column.property,
            fieldName: columnIdFieldNameMapper[column.property]
        });
    };

    const {
        nodes,
        totalCount,
        hasMore,
        error,
        loading,
        refetch,
        loadMore
    } = useDialogPickerContent({
        lang,
        pickerConfig,
        selectedPath,
        searchTerms,
        fieldSorter: {
            fieldName: sort.fieldName,
            sortType: sort.order
        }
    });

    useEffect(() => {
        registry.addOrReplace('refetch-upload', 'refetch-content-list', {
            refetch
        });
        return () => {
            registry.remove('refetch-upload', 'refetch-content-list');
        };
    }, [refetch]);

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        console.warn(message);
        notifyAccessDenied(error, notificationContext, t);
    }

    if (loading) {
        return <LoaderOverlay/>;
    }

    const isSearch = Boolean(searchTerms);
    const tableData = error ?
        [] :
        nodes.map(content => {
            const isSelectable = content.isNodeType && (!pickerConfig.showOnlyNodesWithTemplates || (pickerConfig.showOnlyNodesWithTemplates && content.isDisplayableNode));
            return {
                id: content.uuid,
                path: content.path,
                selectable: isSelectable,
                name: content.displayName,
                subContentsCount: !isSearch && content.primaryNodeType.name === 'jnt:page' ? 0 : undefined,
                lazyRowLoader: !isSearch && content.primaryNodeType.name !== 'jnt:page' ?
                    SubContentCountLazyLoader :
                    undefined,
                type: content.primaryNodeType.typeName,
                createdBy: content.createdBy ? content.createdBy.value : undefined,
                lastModified: content.lastModified ? dayjs(content.lastModified.value)
                    .locale(uilang)
                    .format('LLL') : undefined,
                props: {
                    navigateInto: {
                        onClick: e => {
                            e.preventDefault();
                            setSelectedPath(content.path);
                        }
                    },
                    selectableTypesTable: pickerConfig.selectableTypesTable
                }
            };
        });

    return (
        <>
            <CountDisplayer totalCount={totalCount}/>

            <ContentTable
                columns={columnConfig(t, !isSearch)}
                labelEmpty={
                    searchTerms ?
                        t('content-editor:label.contentEditor.edit.fields.contentPicker.noSearchResults') :
                        t('content-editor:label.contentEditor.edit.fields.contentPicker.noContent')
                }
                initialSelection={initialSelection}
                data={tableData}
                order={sort.order.toLowerCase()}
                orderBy={sort.columnId}
                hasMore={hasMore}
                loadMore={loadMore}
                error={error}
                onSelect={setSelectedItem}
                onSort={handleSort}
            />
        </>
    );
};

List.defaultProps = {
    initialSelection: [],
    searchTerms: ''
};

List.propTypes = {
    pickerConfig: PropTypes.object.isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    selectedPath: PropTypes.string.isRequired,
    setSelectedPath: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    initialSelection: PropTypes.array,
    searchTerms: PropTypes.string
};

List.displayName = 'List';
