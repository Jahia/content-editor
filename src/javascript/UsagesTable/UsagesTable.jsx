import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import styles from './UsagesTable.scss';
import {Table, TableBody, TablePagination, TableRow, Typography} from '@jahia/moonstone';
import {useTable} from 'react-table';
import {allColumnData} from '../SelectorTypes/Picker/reactTable/columns/index';
import {ContentListHeader, reactTable} from '@jahia/jcontent';
import {useQuery} from '@apollo/react-hooks';
import {UsagesQuery} from './UsagesTable.gql-queries';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Paper} from '@material-ui/core';

const defaultCols = ['publicationStatus', 'name', 'type', 'location'];
const columns = defaultCols.map(c => (typeof c === 'string') ? allColumnData.find(col => col.id === c) : c);

export const UsagesTable = ({path, language}) => {
    const {t} = useTranslation('jcontent');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState({order: 'ASC', orderBy: 'displayName'});
    const {data, loading} = useQuery(UsagesQuery, {
        variables: {
            path,
            language,
            pageSize: pageSize,
            currentPage: currentPage * pageSize,
            fieldSorter: sort.orderBy === '' ? null : {
                sortType: sort.order === '' ? null : (sort.order === 'DESC' ? 'DESC' : 'ASC'),
                fieldName: sort.orderBy === '' ? null : 'node.' + sort.orderBy,
                ignoreCase: true
            }
        },
        fetchPolicy: 'cache-and-network'
    });

    const usages = data?.jcr?.nodeByPath?.usages?.nodes ? Object.values(data.jcr.nodeByPath.usages.nodes.reduce((acc, ref) => (
        {
            ...acc,
            [ref.node.uuid]: {
                ...ref.node,
                locales: ref.properties.map(property => property.language)
            }
        }
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
            sort,
            onSort: (column, order) => {
                setSort({order, orderBy: column.property});
            }
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
                    {t('jcontent:label.contentEditor.edit.advancedOption.usages.none')}
                </Typography>
                <Typography variant="body">
                    {t('jcontent:label.contentEditor.edit.advancedOption.usages.noneDescription')}
                </Typography>
            </section>
        );
    }

    return (
        <Paper className={styles.contentPaper} data-sel-role="usages">
            <div className={clsx('flexFluid', 'flexCol')}>
                <div className={clsx(styles.tableWrapper, 'flexFluid')}>
                    <Table aria-labelledby="tableUsages"
                           data-cm-role="table-usages-list"
                           style={{width: '100%', minWidth: '1100px', maxHeight: '75vh'}}
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
                </div>
                <TablePagination
                    className={styles.pagination}
                    totalNumberOfRows={data?.jcr?.nodeByPath?.usages?.pageInfo.totalCount}
                    currentPage={currentPage + 1}
                    rowsPerPage={pageSize}
                    label={{
                        rowsPerPage: t('jcontent:label.pagination.rowsPerPage'),
                        of: t('jcontent:label.pagination.of')
                    }}
                    rowsPerPageOptions={[10, 20, 50]}
                    onPageChange={page => {
                        setCurrentPage(page - 1);
                    }}
                    onRowsPerPageChange={size => {
                        setCurrentPage(Math.floor(currentPage * pageSize / size));
                        setPageSize(size);
                    }}
                />
            </div>
        </Paper>
    );
};

UsagesTable.propTypes = {
    path: PropTypes.string.isRequired,

    language: PropTypes.string.isRequired
};
