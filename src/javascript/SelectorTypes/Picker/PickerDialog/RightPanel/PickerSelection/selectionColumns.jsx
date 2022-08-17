import {reactTable, FileSize} from '@jahia/jcontent';
import {Button, Close, TableBodyCell} from '@jahia/moonstone';
import React from 'react';
import {getRelativePath} from '~/SelectorTypes/Picker/Picker2.utils';
import PropTypes from 'prop-types';
import styles from './Selection.scss';
import {useDispatch} from 'react-redux';
import {cePickerRemoveSelection} from '~/SelectorTypes/Picker/Picker2.redux';

const rowPropType = {
    row: PropTypes.shape({original: PropTypes.object.isRequired})
};

const FileSizeCell = ({row}) => (
    <TableBodyCell data-cm-role="file-size-cell"><FileSize node={row.original}/></TableBodyCell>
);
FileSizeCell.propTypes = rowPropType;

const RelPathCell = ({row}) => (
    <TableBodyCell data-cm-role="rel-path-cell">
        {getRelativePath(row.original.path, row.original.site.path)}
    </TableBodyCell>
);
RelPathCell.propTypes = rowPropType;

const ActionsCell = ({row}) => {
    const dispatch = useDispatch();
    return (
        <TableBodyCell className={styles.cellActions} data-cm-role="actions-cell">
            <Button variant="ghost"
                    icon={<Close/>}
                    onClick={() => dispatch(cePickerRemoveSelection(row.original))}/>
        </TableBodyCell>
    );
};

ActionsCell.propTypes = rowPropType;

export const selectionColumns = [
    {
        id: 'publicationStatus',
        sortable: false,
        Header: '',
        Cell: reactTable.CellPublicationStatus
    },
    {
        id: 'name',
        accessor: 'displayName',
        label: 'jcontent:label.contentManager.listColumns.name',
        property: 'displayName',
        Cell: reactTable.CellName
    },
    {
        id: 'type',
        accessor: 'primaryNodeType.displayName',
        label: 'jcontent:label.contentManager.listColumns.type',
        property: 'primaryNodeType.displayName',
        Cell: reactTable.CellType
    },
    {
        id: 'fileSize',
        Cell: FileSizeCell
    },
    {
        id: 'relPath',
        Cell: RelPathCell
    },
    {
        id: 'cellActions',
        Cell: ActionsCell
    }
];
