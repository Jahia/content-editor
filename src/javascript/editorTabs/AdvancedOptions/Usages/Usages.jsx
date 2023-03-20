import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './Usages.scss';
import {Table, TableBody, TableRow, Typography} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {ContentListHeader, reactTable} from '@jahia/jcontent';
import {useQuery} from '@apollo/react-hooks';
import {useContentEditorConfigContext} from '~/contexts';
import {UsagesQuery} from './Usages.gql-queries';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';

const defaultCols = ['publicationStatus', 'name', 'type', 'location'];
const columns = defaultCols.map(c => (typeof c === 'string') ? allColumnData.find(col => col.id === c) : c);

export const Usages = () => {
    const {t} = useTranslation('content-editor');

    const {nodeData} = useContentEditorContext();
    const {lang} = useContentEditorConfigContext();

    const {data, loading} = useQuery(UsagesQuery, {
        variables: {path: nodeData.path, language: lang}
    });

    const usages = data?.jcr?.nodeByPath?.usages?.nodes ? Object.values(data.jcr.nodeByPath.usages.nodes.reduce((acc, ref) => (
        {...acc, [ref.node.uuid]: {...ref.node, locales: acc[ref.node.uuid] ? [...acc[ref.node.uuid]?.locales, ref.language] : [ref.language]}}
    ), {})) : [];

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: tableRows,
        prepareRow
    } = useTable(
        {
            columns: columns,
            data: usages,
            sort: {orderBy: 'name'}
        },
        reactTable.useSort
    );

    if (loading) {
        return <LoaderOverlay/>;
    }

    if (usages.length === 0) {
        return (
            <section className={styles.container}>
                <Typography variant="heading">
                    {t('content-editor:label.contentEditor.edit.advancedOption.usages.none')}
                </Typography>
                <Typography variant="body">
                    {t('content-editor:label.contentEditor.edit.advancedOption.usages.noneDescription')}
                </Typography>
            </section>
        );
    }

    return (
        <section className={styles.tableContainer}>
            <Table aria-labelledby="tableUsages"
                   data-cm-role="table-usages-list"
                   {...getTableProps()}
            >
                <ContentListHeader headerGroups={headerGroups} headerClasses={styles}/>
                <TableBody {...getTableBodyProps()}>
                    {tableRows.map(row => {
                        prepareRow(row);
                        return (
                            <TableRow key={'row' + row.id}
                                      {...row}
                            >
                                {row.cells.map(cell => (
                                    <React.Fragment
                                    key={cell.column.id}
                                    >{cell.render('Cell')}
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </section>
    );
};

Usages.propTypes = {};
