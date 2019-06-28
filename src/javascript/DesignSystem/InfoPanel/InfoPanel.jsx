import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import {Typography} from '@jahia/design-system-kit';
import {LabelledInfo} from '../LabelledInfo';

export const InfoPanelVariant = ['twoColumn', 'oneColumn'];

const style = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        borderBottom: `1px solid ${theme.palette.ui.delta}`,
        lineHeight: '1.8rem',
        marginBottom: theme.spacing.unit * 2
    },
    values: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    // OneColumn
    [InfoPanelVariant[1]]: {
        '& $values div': {
            width: '100%'
        }
    },
    // TwoColumn
    [InfoPanelVariant[0]]: {
        '& $values div': {
            width: '48%'
        }
    }
});

const InfoPanelCmp = ({panelTitle, infos, variant, classes}) => {
    return (
        <section className={`${classes.container} ${classes[variant]}`}>
            <Typography className={classes.title} component="h2" variant="gamma" color="alpha">{panelTitle}</Typography>
            <div className={classes.values}>
                {infos.map(info => <LabelledInfo key={info.label} {...info}/>)}
            </div>
        </section>
    );
};

InfoPanelCmp.defaultProps = {
    variant: InfoPanelVariant[0],
    panelTitle: '',
    infos: []
};

InfoPanelCmp.propTypes = {
    panelTitle: PropTypes.string,
    infos: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
    })),
    variant: PropTypes.oneOf(InfoPanelVariant),
    classes: PropTypes.object.isRequired
};

export const InfoPanel = withStyles(style)(InfoPanelCmp);

InfoPanel.displayName = 'InfoPanel';
