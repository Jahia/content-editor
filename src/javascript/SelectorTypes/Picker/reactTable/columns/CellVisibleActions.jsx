import React from 'react';
import {TableBodyCell} from '@jahia/moonstone';
import {DisplayAction} from '@jahia/ui-extender';
import {ButtonRendererNoLabel} from '~/utils/getButtonRenderer';
import PropTypes from 'prop-types';
import classes from './Cells.scss';

export const CellVisibleActions = ({row, cell, column}) => {
    return (
        <TableBodyCell key={row.id + column.id}
                       className={classes.visibleActions}
                       {...cell.getCellProps()}
                       width={column.width}
                       data-cm-role="table-content-list-cell-actions"
        >
            <DisplayAction
                actionKey="contentPickerMenu"
                path={row.original.path}
                render={ButtonRendererNoLabel}
                buttonProps={{variant: 'ghost', size: 'big'}}
            />
        </TableBodyCell>
    );
};

CellVisibleActions.propTypes = {
    value: PropTypes.string,
    cell: PropTypes.object,
    column: PropTypes.object,
    row: PropTypes.object
};
