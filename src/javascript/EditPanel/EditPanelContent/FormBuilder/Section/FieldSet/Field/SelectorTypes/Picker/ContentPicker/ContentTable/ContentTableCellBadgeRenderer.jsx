import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Badge} from '@material-ui/core';

const styles = theme => ({
    badge: {
        backgroundColor: theme.palette.brand.alpha,
        color: theme.palette.invert.beta,
        right: `-${theme.spacing.unit * 3}px`
    }
});

export const ContentTableCellBadgeRendererCmp = ({tableCellData, classes}) => {
    return (
        <Badge
            badgeContent={tableCellData}
            invisible={tableCellData === undefined || tableCellData === 0}
            data-cm-role="sub-contents-count"
            classes={{badge: classes.badge}}
         />
    );
};

ContentTableCellBadgeRendererCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    tableCellData: PropTypes.object.isRequired
};

const ContentTableCellBadgeRenderer = withStyles(styles)(ContentTableCellBadgeRendererCmp);
ContentTableCellBadgeRenderer.displayName = 'ContentTableCellBadgeRenderer';
export default ContentTableCellBadgeRenderer;
