import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import {Typography} from '@jahia/ds-mui-theme';
import {DisplayActions} from '@jahia/react-material';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';

const styles = theme => ({
    addImage: {
        width: '100%',
        height: theme.spacing.unit * 9,
        backgroundColor: theme.palette.ui.omega,
        // TODO border: `1px ${theme.palette.ui.zeta} dashed`,
        border: '1px #C1C8D5 dashed',
        fontSize: '0.875rem',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            // TODO border: `1px ${theme.palette.ui.zeta} dashed`,
            border: '1px #C1C8D5 solid'
        }
    },
    imageSelectedContainer: {
        height: theme.spacing.unit * 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // TODO border: `1px ${theme.palette.ui.zeta} solid`,
        border: '1px #C1C8D5 solid',
        borderRadius: '2px'
    },
    imageSelectedImgContainer: {
        height: theme.spacing.unit * 9,
        width: theme.spacing.unit * 9,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.ui.zeta
    },
    imageSelectedImg: {
        width: '100%',
        position: 'relative'
    },
    imageSelectedMetadata: {
        flexGrow: 1,
        padding: '2rem'
    }
});

// TODO use the ID to link it to the input field
// eslint-disable-next-line
const MediaPickerCmp = ({field, id, t, classes}) => {
    if (!field.data.value) {
        return (
            <>
                <button className={classes.addImage} type="button">
                    <ImageIcon/>
                    {t(
                        'content-editor:label.contentEditor.edit.fields.imagePicker.addImage'
                    )}
                </button>
            </>
        );
    }

    return (
        <article className={classes.imageSelectedContainer}>
            <div className={classes.imageSelectedImgContainer}>
                <img
                    className={classes.imageSelectedImg}
                    src={field.imageData.url}
                    alt=""
                />
            </div>
            <div className={classes.imageSelectedMetadata}>
                <Typography variant="zeta" color="alpha">
                    {field.imageData.name}
                </Typography>
                <Typography variant="omega" color="gamma">
                    {field.imageData.type} - {field.imageData.size[0]}x{field.imageData.size[1]}px - {field.imageData.weight}mb
                </Typography>
            </div>
            <DisplayActions
                context={{}}
                target="mediaPickerActions"
                render={({context}) => {
                    return (
                        <IconButton
                            onClick={e => {
                                context.onClick(context, e);
                            }}
                        >
                            {context.buttonIcon}
                        </IconButton>
                    );
                }}
            />
        </article>
    );
};

MediaPickerCmp.defaultProps = {
    classes: {}
};

MediaPickerCmp.propTypes = {
    field: PropTypes.shape({
        data: PropTypes.shape({
            value: PropTypes.string
        }).isRequired,
        imageData: PropTypes.shape({
            url: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            size: PropTypes.arrayOf(PropTypes.number).isRequired,
            weight: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired
        })
    }).isRequired,
    id: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.object
};

export const MediaPicker = compose(
    translate(),
    withStyles(styles)
)(MediaPickerCmp);
