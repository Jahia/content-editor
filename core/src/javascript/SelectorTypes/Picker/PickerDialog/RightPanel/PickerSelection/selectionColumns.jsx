import {Button, Close, TableBodyCell} from '@jahia/moonstone';
import React from 'react';
import styles from './Selection.scss';
import {useDispatch} from 'react-redux';
import {cePickerRemoveSelection} from '~/SelectorTypes/Picker/Picker.redux';
import {allColumnData} from '~/SelectorTypes/Picker/reactTable/columns';
import {rowPropType} from '~/SelectorTypes/Picker/reactTable/columns/rowPropType';

const ActionsCell = ({row}) => {
    const dispatch = useDispatch();
    return (
        <TableBodyCell className={styles.cellActions} data-cm-role="actions-cell">
            <Button variant="ghost"
                    icon={<Close/>}
                    onClick={() => dispatch(cePickerRemoveSelection(row.original.uuid))}/>
        </TableBodyCell>
    );
};

ActionsCell.propTypes = rowPropType;

export const selectionColumns = [
    ...allColumnData,
    {
        id: 'cellActions',
        Cell: ActionsCell
    }
];
