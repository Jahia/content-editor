import React, {useEffect} from 'react';
import DSContentTable from '~/DesignSystem/ContentTable/ContentTable';
import {useTranslation} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {useDialogPickerContent} from '../useDialogPickerContent';
import dayjs from 'dayjs';
import {registry} from '@jahia/ui-extender';
import ContentTableCellBadgeRenderer from './ContentTableCellBadgeRenderer';
import {NavigateInto} from './NavigateInto';
import {CountDisplayer} from '../CountDisplayer';

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
    const {t} = useTranslation();
    const {
        nodes,
        totalCount,
        hasMore,
        error,
        loading,
        refetch,
        loadMore
    } = useDialogPickerContent(lang, pickerConfig, selectedPath, searchTerms);

    useEffect(() => {
        registry.addOrReplace('refetch-upload', 'refetch-content-list', {
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
                .locale(uilang)
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

    return (
        <>
            <CountDisplayer totalCount={totalCount}/>

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
                hasMore={hasMore}
                loadMore={loadMore}
                error={error}
                onSelect={setSelectedItem}
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
