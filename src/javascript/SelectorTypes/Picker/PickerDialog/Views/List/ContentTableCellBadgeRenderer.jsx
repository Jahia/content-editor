import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Badge, CircularProgress} from '@material-ui/core';

const styles = theme => ({
    badge: {
        backgroundColor: theme.palette.brand.alpha,
        color: theme.palette.invert.beta,
        right: `-${theme.spacing.unit * 3}px`
    },
    loader: {
        marginLeft: `${(theme.spacing.unit * 3) / 2}px`
    }
});

export const ContentTableCellBadgeRendererCmp = ({tableCellData, classes}) => {
    if (tableCellData === undefined) {
        return (
            <CircularProgress
                size={20}
                thickness={5}
                classes={{root: classes.loader}}
            />
        );
    }

    return (
        <Badge
            badgeContent={tableCellData}
            invisible={tableCellData === 0}
            data-cm-role="sub-contents-count"
            classes={{badge: classes.badge}}
         />
    );
};

ContentTableCellBadgeRendererCmp.defaultProps = {
    tableCellData: undefined
};

ContentTableCellBadgeRendererCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    tableCellData: PropTypes.number
};

const ContentTableCellBadgeRenderer = withStyles(styles)(ContentTableCellBadgeRendererCmp);
ContentTableCellBadgeRenderer.displayName = 'ContentTableCellBadgeRenderer';
export default ContentTableCellBadgeRenderer;
