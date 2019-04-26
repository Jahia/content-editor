import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import {DisplayActions, ProgressOverlay} from '@jahia/react-material';
import IconButton from '@material-ui/core/IconButton';
import {compose} from 'react-apollo';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import {MediaPickerQuery} from './MediaPicker.gql-queries';

const styles = theme => ({
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

const MediaPickerCmp = ({t, field, classes}) => {
    const {data, error, loading} = useQuery(MediaPickerQuery, {
        variables: {
            uuid: field.data.value
        }
    });

    if (error) {
        const message = t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')});
        return (<>{message}</>);
    }

    if (loading) {
        return (<ProgressOverlay/>);
    }

    const imageData = data.jcr.result;
    const fieldData = {
        data: {
            value: field.data.value
        },
        imageData: {
            url: `${window.contextJsParameters.contextPath}/files/default${imageData.path}`,
            name: imageData.name,
            size: [parseInt(imageData.height.value, 10), parseInt(imageData.width.value, 10)],
            weight: 1.2,
            type: imageData.children.nodes[0].mimeType.value
        }
    };

    return (
        <article className={classes.imageSelectedContainer}>
            <div className={classes.imageSelectedImgContainer}>
                <img
                    className={classes.imageSelectedImg}
                    src={fieldData.imageData.url}
                    alt=""
                />
            </div>
            <div className={classes.imageSelectedMetadata}>
                <Typography variant="zeta" color="alpha">
                    {fieldData.imageData.name}
                </Typography>
                <Typography variant="omega" color="gamma">
                    {fieldData.imageData.type} - {fieldData.imageData.size[0]}x
                    {fieldData.imageData.size[1]}px - {fieldData.imageData.weight}mb
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
    t: PropTypes.func.isRequired,
    field: PropTypes.shape({
        data: PropTypes.shape({
            value: PropTypes.string
        }),
        imageData: PropTypes.shape({
            url: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            size: PropTypes.arrayOf(PropTypes.number).isRequired,
            weight: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired
        })
    }).isRequired,
    classes: PropTypes.object
};

export const MediaPicker = compose(
    translate(),
    withStyles(styles)
)(MediaPickerCmp);
