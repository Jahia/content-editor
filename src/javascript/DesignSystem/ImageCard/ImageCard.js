import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    container: {
        borderRadius: '3px',
        display: 'flex',
        flexDirection: 'column',
        height: '20vw',
        width: '20vw',
        padding: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: theme.spacing.unit
    },
    imgContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        width: '20vw',
        height: '15vw',
        '& img': {
            height: '100%',
            position: 'relative'
        }
    },
    infoContainer: {
        marginBottom: '1rem',
        width: '100%',
        textAlign: 'center'
    }
});

const ImageCardCmp = ({image, classes, selected, onDoubleClick, onClick}) => {
    return (
        <Paper elevation={1} className={classes.container} onDoubleClick={onDoubleClick} onClick={onClick}>
            <div className={classes.imgContainer}>
                <img src={image.path} alt={image.name}/>
            </div>
            <div className={classes.infoContainer}>
                <Typography component="h3" variant="zeta" color="alpha">{image.name}</Typography>
                <Typography variant="omega" color="gamma">
                    {image.type}{(image.width && image.height) && ` - ${image.width}x${image.height}px`}
                </Typography>
                {selected}
            </div>
        </Paper>
    );
};

ImageCardCmp.defaultProps = {
    onDoubleClick: () => {},
    onClick: () => {},
    selected: false
};

ImageCardCmp.propTypes = {
    image: PropTypes.shape({
        path: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string
    }).isRequired,
    selected: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onDoubleClick: PropTypes.func,
    onClick: PropTypes.func
};

export const ImageCard = withStyles(styles)(ImageCardCmp);
