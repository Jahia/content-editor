import {TableBodyCell, Typography} from '@jahia/moonstone';
import React from 'react';
import {DisplayAction} from '@jahia/ui-extender';
import {ButtonRendererNoLabel} from '~/utils';
import classes from './Cells.scss';
import PropTypes from 'prop-types';
export const LocationCell = ({row, column}) => {
    return (
        <TableBodyCell data-cm-role="location-cell" className={classes.cellLocation} width={column.width}>
            <div className={classes.location}>
                <Typography variant="body">{row.original.path}</Typography>
                <div data-cm-role="table-usages-cell-actions">
                    <DisplayAction
                        actionKey="previewInNewTab"
                        path={row.original.path}
                        render={ButtonRendererNoLabel}
                        buttonProps={{variant: 'ghost', size: 'big'}}
                    />
                    <DisplayAction
                        actionKey="openInNewTab"
                        path={row.original.path}
                        render={ButtonRendererNoLabel}
                        buttonProps={{variant: 'ghost', size: 'big'}}
                    />
                </div>
            </div>
        </TableBodyCell>
    );
};

LocationCell.propTypes = {
    column: PropTypes.object,
    row: PropTypes.object
};
