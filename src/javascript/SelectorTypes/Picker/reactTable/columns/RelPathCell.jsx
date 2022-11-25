import {TableBodyCell} from '@jahia/moonstone';
import {getRelativePath} from '~/SelectorTypes/Picker/Picker.utils';
import React from 'react';
import {rowPropType} from '~/SelectorTypes/Picker/reactTable/columns/rowPropType';

export const RelPathCell = ({row}) => (
    <TableBodyCell data-cm-role="rel-path-cell">
        {getRelativePath(row.original.path, row.original.site.path)}
    </TableBodyCell>
);

RelPathCell.propTypes = rowPropType;
