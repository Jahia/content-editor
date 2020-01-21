import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Card} from '../Card/';
import {Typography} from '@jahia/design-system-kit';
import InfiniteScroll from 'react-infinite-scroller';

import {withStyles} from '@material-ui/core';

const styles = () => ({
    container: {
        height: '100%',
        overflow: 'auto',
        '& > div': {
            display: 'flex',
            flex: '1 1 0%',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }
    }
});

export const ImageListCmp = ({error, images, isMultipleSelectable, loadMore, hasMore, classes, onImageDoubleClick, onImageSelection, initialSelection, labelEmpty}) => {
    const [selectedImages, setSelectedImages] = useState(
        initialSelection
            .map(path => images.find(i => i.path === path))
            .filter(img => Boolean(img))
    );

    const onClickHandler = useCallback(img => {
        const imgSelectedIndex = selectedImages.findIndex(i => i.uuid === img.uuid);
        let newSelectedImg;
        if (imgSelectedIndex === -1) {
            newSelectedImg = isMultipleSelectable ? [...selectedImages, img] : [img];
        } else if (isMultipleSelectable) { // If it's an unselect for multipleSelectable
            newSelectedImg = [...selectedImages];
            newSelectedImg.splice(imgSelectedIndex, 1);
        } else { // If it's an unselect for singleSelectable then, set array empty
            newSelectedImg = [];
        }

        setSelectedImages(newSelectedImg);
        onImageSelection(isMultipleSelectable ? newSelectedImg : (newSelectedImg[0] || null));
    }, [isMultipleSelectable, onImageSelection, selectedImages]);

    if (error) {
        return <Typography component="section">Erreur : {error.message}</Typography>;
    }

    return (
        <section className={classes.container}>
            <InfiniteScroll
                pageStart={0}
                hasMore={hasMore}
                loadMore={loadMore}
                useWindow={false}
            >
                {
                images && images.length === 0 ?
                    <Typography variant="p">{labelEmpty}</Typography> :

                    images.map(img => {
                        return (
                            <Card
                                key={img.uuid}
                                image={{src: img.url, alt: img.name}}
                                headerText={img.name}
                                subhead={`${img.type}${img.width && img.height ? ` - ${img.width}x${img.height}px` : ''}`}
                                selected={Boolean(selectedImages.find(i => i.uuid === img.uuid))}
                                onDoubleClick={() => onImageDoubleClick(img)}
                                onClick={() => onClickHandler(img)}
                            />
                        );
                    })
            }
            </InfiniteScroll>
        </section>
    );
};

ImageListCmp.defaultProps = {
    error: null,
    images: [],
    initialSelection: [],
    isMultipleSelectable: false,
    onImageSelection: () => {},
    onImageDoubleClick: () => {},
    loadMore: () => {},
    hasMore: false
};

ImageListCmp.propTypes = {
    error: PropTypes.shape({message: PropTypes.string}),
    images: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string,
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
    })),
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    initialSelection: PropTypes.arrayOf(PropTypes.string),
    isMultipleSelectable: PropTypes.bool,
    labelEmpty: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    onImageDoubleClick: PropTypes.func,
    onImageSelection: PropTypes.func
};

export const ImageList = withStyles(styles)(ImageListCmp);
ImageList.displayName = 'ImageList';
