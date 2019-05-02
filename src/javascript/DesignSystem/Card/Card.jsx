import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import {CheckBox} from '../CheckBox/';

const styles = theme => ({
    container: {
        borderRadius: '1px',
        border: `1px solid ${theme.palette.ui.omega}`,
        boxShadow: '1px 2px 4px rgba(72, 87, 97, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '20vw',
        width: '20vw',
        padding: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: theme.spacing.unit,
        '&:hover': {
            // TODO replace next line with border: `1px solid ${theme.palette.ui.zeta}`
            border: '1px solid #C1C8D5'
        }
    },
    containerSelected: {
        border: `1px solid ${theme.palette.brand.alpha}`
    },
    imgContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        width: 'calc(20vw - 2px)',
        height: '15vw',
        '& img': {
            height: '100%',
            position: 'relative'
        }
    },
    infoContainer: {
        padding: '1rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    checkBox: {
        height: '24px',
        width: '24px'
    }
});

const CardCmp = ({image, headerText, subhead, classes, selected, onDoubleClick, onClick}) => {
    return (
        <article
            className={`${classes.container} ${selected ? classes.containerSelected : ''}`}
            aria-checked={selected}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
        >
            <div className={classes.imgContainer}>
                <img src={image.src} alt={image.alt}/>
            </div>
            <div className={classes.infoContainer}>
                <div>
                    <Typography component="h3" variant="zeta" color="alpha">{headerText}</Typography>
                    <Typography variant="omega" color="gamma">
                        {subhead}
                    </Typography>
                </div>

                <CheckBox className={classes.checkBox} checked={selected}/>
            </div>
        </article>
    );
};

CardCmp.defaultProps = {
    headerText: '',
    subhead: '',
    selected: false,
    onDoubleClick: () => {},
    onClick: () => {}
};

CardCmp.propTypes = {
    image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired
    }).isRequired,
    headerText: PropTypes.string,
    subhead: PropTypes.string,
    selected: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onDoubleClick: PropTypes.func,
    onClick: PropTypes.func
};

export const Card = withStyles(styles)(CardCmp);

Card.displayName = 'Card';
