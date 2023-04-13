import {TableBodyCell} from '@jahia/moonstone';
import React from 'react';
import {FileSize} from '@jahia/jcontent';
import {rowPropType} from '~/SelectorTypes/Picker/reactTable/columns/rowPropType';

export const FileSizeCell = ({row}) => (
    <TableBodyCell data-cm-role="file-size-cell"><FileSize node={row.original}/></TableBodyCell>
);

FileSizeCell.propTypes = rowPropType;
