import {TableBodyCell, Typography} from '@jahia/moonstone';
import React from 'react';
import {DisplayAction} from '@jahia/ui-extender';
import {ButtonRendererNoLabel, cutStringInTheMiddle} from '~/utils';
import classes from './Cells.scss';
import PropTypes from 'prop-types';
import {useViewport} from '~/contexts';
export const LocationCell = ({row, column}) => {
    const {width} = useViewport();
    const truncate = Math.max(Math.floor(width / 40), 25);
    return (
        <TableBodyCell data-cm-role="location-cell" className={classes.cellLocation} width={column.width}>
            <div className={classes.location}>
                <Typography variant="body"
                            className={classes.path}
                >{cutStringInTheMiddle(row.original.path, truncate, truncate, '...')}
                </Typography>
                <div className={classes.usagesActions} data-cm-role="table-usages-cell-actions">
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
