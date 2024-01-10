import React, {useMemo} from 'react';
import {Table, TableBody, TableRow} from '@jahia/moonstone';
import styles from './Selection.scss';
import {useTable} from 'react-table';
import {selectionColumns} from './selectionColumns';
import PropTypes from 'prop-types';
import {configPropType} from '../../../configs/configPropType';

const defaultCols = ['publicationStatus', 'name', 'type', 'relPath'];

const SelectionTable = ({selection, pickerConfig}) => {
    const columns = useMemo(() => {
        const colNames = pickerConfig?.selectionTable?.columns || defaultCols;
        const selectedColumns = colNames.map(c => (typeof c === 'string') ? selectionColumns.find(col => col.id === c) : c);
        selectedColumns.push(selectionColumns.find(col => col.id === 'cellActions'));
        return selectedColumns;
    }, [pickerConfig]);

    const {
        getTableProps,
        getTableBodyProps,
        rows,
        prepareRow
    } = useTable({data: selection, columns});

    return (
        <Table data-cm-role="selection-table" {...getTableProps()}>
            <TableBody {...getTableBodyProps()}>
                {rows.map(row => {
                        prepareRow(row);
                        return (
                            <TableRow
                                key={`row-${row.id}`}
                                data-sel-path={row.original.path}
                                {...row.getRowProps()}
                                className={styles.tableRow}
                            >
                                {
                                    row.cells.map(cell => (
                                        <React.Fragment key={cell.column.id}>
                                            {cell.render('Cell')}
                                        </React.Fragment>
                                    ))
                                }
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
};

SelectionTable.propTypes = {
    selection: PropTypes.array.isRequired,
    pickerConfig: configPropType.isRequired
};

export default SelectionTable;
