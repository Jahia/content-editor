import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './Usages.scss';
import {Table, TableBody, TableRow, Typography} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {ContentListHeader, reactTable} from '@jahia/jcontent';

const defaultCols = ['publicationStatus', 'name', 'type', 'location'];

export const Usages = () => {
    const {t} = useTranslation('content-editor');
    const {usages} = useContentEditorContext();
    const columns = defaultCols.map(c => (typeof c === 'string') ? allColumnData.find(col => col.id === c) : c);
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
        <Table aria-labelledby="tableUsages"
               data-cm-role="table-usages-list"
               {...getTableProps()}
        >
            <ContentListHeader headerGroups={headerGroups}/>
            <TableBody {...getTableBodyProps()}>
                {tableRows.map(row => {
                    prepareRow(row);
                    return (
                        <TableRow key={'row' + row.id}
                                  {...row}
                        >
                            {row.cells.map(cell => <React.Fragment key={cell.column.id}>{cell.render('Cell')}</React.Fragment>)}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

Usages.propTypes = {};
