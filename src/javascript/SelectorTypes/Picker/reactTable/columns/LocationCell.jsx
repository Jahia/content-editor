import {TableBodyCell, Typography} from '@jahia/moonstone';
import React from 'react';
import {rowPropType} from '~/SelectorTypes/Picker/reactTable/columns/rowPropType';
import {DisplayAction} from '@jahia/ui-extender';
import {ButtonRendererNoLabel} from '~/utils';
import classes from './Cells.scss';
export const LocationCell = ({row}) => {
    return (
        <TableBodyCell data-cm-role="location-cell">
            <div className={classes.location}>
                <Typography variant="body">{row.original.path}</Typography>
                <div data-cm-role="table-usages-cell-actions">
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

LocationCell.propTypes = rowPropType;
