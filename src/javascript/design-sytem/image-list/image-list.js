import React from 'react';
import PropTypes from 'prop-types';
import {ImageCard} from '../image-card/image-card';
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

export const ImageListCmp = ({error, images, classes}) => {
    if (error) {
        return <Typography component="section">Erreur : {error.message}</Typography>;
    }

    return (
        <section className={classes.container}>
            {images.map(img => {
                return <ImageCard key={img.path} image={img}/>;
            })}
        </section>
    );
};

ImageListCmp.defaultProps = {
    error: null,
    images: []
};

ImageListCmp.propTypes = {
    error: PropTypes.shape({message: PropTypes.string}),
    images: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired,
        height: PropTypes.string.isRequired
    })),
    classes: PropTypes.object.isRequired
};

export const ImageList = withStyles(styles)(ImageListCmp);
