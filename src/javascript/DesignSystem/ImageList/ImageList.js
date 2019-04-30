import React from 'react';
import PropTypes from 'prop-types';
import {ImageCard} from '../ImageCard/ImageCard';
import {Typography} from '@jahia/ds-mui-theme';

import {withStyles} from '@material-ui/core';

const styles = () => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: '6rem'
    }
});

export const ImageListCmp = ({error, images, classes, onImageDoubleClick}) => {
    if (error) {
        return <Typography component="section">Erreur : {error.message}</Typography>;
    }

    return (
        <section className={classes.container}>
            {images.map(img => {
                return <ImageCard key={img.path} image={img} onDoubleClick={() => onImageDoubleClick(img)}/>;
            })}
        </section>
    );
};

ImageListCmp.defaultProps = {
    onImageDoubleClick: () => {},
    error: null,
    images: []
};

ImageListCmp.propTypes = {
    error: PropTypes.shape({message: PropTypes.string}),
    images: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string
    })),
    classes: PropTypes.object.isRequired,
    onImageDoubleClick: PropTypes.func
};

export const ImageList = withStyles(styles)(ImageListCmp);
