import React, {useMemo} from 'react';
import {Table, TableBody, TableRow} from '@jahia/moonstone';
import styles from './Selection.scss';
import {useTable} from 'react-table';
import {selectionColumns} from './selectionColumns';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

const SelectionTable = ({selection}) => {
    const modes = useSelector(state => state.contenteditor.picker.modes);
    const columns = useMemo(() => {
        const modeSet = new Set(modes);
        return (modeSet.size === 1 && modeSet.has('picker-media')) ?
            selectionColumns.filter(c => c.id !== 'type') :
            selectionColumns.filter(c => c.id !== 'fileSize');
    }, [modes]);

    const {
        getTableProps,
        getTableBodyProps,
        rows,
        prepareRow
    } = useTable({data: selection, columns});

    return (
        <Table aria-label="selection-table" {...getTableProps()}>
            <TableBody {...getTableBodyProps()}>
                {rows.map(row => {
                        prepareRow(row);
                        return (
                            <TableRow key={`row-${row.id}`} {...row.getRowProps()} className={styles.tableRow}>
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
    selection: PropTypes.object.isRequired
};

export default SelectionTable;
