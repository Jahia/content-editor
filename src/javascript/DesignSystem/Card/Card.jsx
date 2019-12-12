import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';
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
            border: `1px solid ${theme.palette.ui.zeta}`
        },
        '&.selected': {
            border: `1px solid ${theme.palette.brand.alpha}`
        }
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
    textContainer: {
        width: '80%',
        '& h3, & p': {
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    },
    checkBox: {
        height: '24px',
        width: '24px'
    }
});

const CardCmp = ({
    image,
    headerText,
    subhead,
    classes,
    selected,
    onDoubleClick,
    onClick
}) => {
    return (
        <article
            data-sel-role-card={image.alt}
            className={`${classes.container} ${
                selected ? 'selected' : ''
            }`}
            aria-checked={selected}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
        >
            <div className={classes.imgContainer}>
                <img src={image.src} alt={image.alt}/>
            </div>
            <div className={classes.infoContainer}>
                <div className={classes.textContainer}>
                    <Typography
                        component="h3"
                        variant="zeta"
                        color="alpha"
                        title={headerText}
                    >
                        {headerText}
                    </Typography>
                    <Typography variant="omega" color="gamma" title={subhead}>
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
