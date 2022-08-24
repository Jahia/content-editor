import React, {useMemo} from 'react';
import {Table, TableBody, TableRow} from '@jahia/moonstone';
import styles from './Selection.scss';
import {useTable} from 'react-table';
import {selectionColumns} from './selectionColumns';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {configPropType} from '../../../configs/configPropType';

const SelectionTable = ({selection, pickerConfig}) => {
    const modes = useSelector(state => state.contenteditor.picker.modes);

    const columns = useMemo(() => {
        if (pickerConfig?.pickerTable?.columns) {
            return pickerConfig.pickerTable.columns.map(c => (typeof c === 'string') ? selectionColumns.find(col => col.id === c) : c);
        }

        // Toggle between showing type or file size column depending on accordion modes
        const modeSet = new Set(modes);
        return (modeSet.size === 1 && modeSet.has('picker-media')) ?
            selectionColumns.filter(c => c.id !== 'type') :
            selectionColumns.filter(c => c.id !== 'fileSize');
    },
    [modes, pickerConfig]);

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
                                        <React.Fragment key={cell.column.id} data-sel-role={`selection-table-${cell.column.id}`}>
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
    selection: PropTypes.object.isRequired,
    pickerConfig: configPropType.isRequired
};

export default SelectionTable;
