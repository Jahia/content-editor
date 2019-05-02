import React, {useState, useCallback} from 'react';
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

export const ImageListCmp = ({error, images, multipleSelectable, classes, onImageDoubleClick, onImageSelection}) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const onClickHandler = useCallback(img => {
        const imgSelectedIndex = selectedImages.findIndex(i => i.uuid === img.uuid);
        let newSelectedImg;
        if (imgSelectedIndex === -1) {
            newSelectedImg = multipleSelectable ? [...selectedImages, img] : [img];
        } else if (multipleSelectable) {
            newSelectedImg = [...selectedImages];
            newSelectedImg.splice(imgSelectedIndex, 1);
        } else {
            newSelectedImg = [];
        }

        setSelectedImages(newSelectedImg);
        onImageSelection(newSelectedImg);
    }, [multipleSelectable, onImageSelection, selectedImages]);

    if (error) {
        return <Typography component="section">Erreur : {error.message}</Typography>;
    }

    return (
        <section className={classes.container}>
            {images.map(img => {
                return (
                    <ImageCard
                        key={img.uuid}
                        image={img}
                        selected={Boolean(selectedImages.find(i => i.uuid === img.uuid))}
                        onDoubleClick={() => onImageDoubleClick(img)}
                        onClick={() => onClickHandler(img)}
                        />
                );
            })}
        </section>
    );
};

ImageListCmp.defaultProps = {
    onImageSelection: () => {},
    onImageDoubleClick: () => {},
    error: null,
    multipleSelectable: true,
    images: []
};

ImageListCmp.propTypes = {
    error: PropTypes.shape({message: PropTypes.string}),
    images: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string
    })),
    classes: PropTypes.object.isRequired,
    multipleSelectable: PropTypes.bool,
    onImageDoubleClick: PropTypes.func,
    onImageSelection: PropTypes.func
};

export const ImageList = withStyles(styles)(ImageListCmp);
