import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {compose} from 'react-apollo';
import {Typography} from '@jahia/ds-mui-theme';
import {DisplayActions, ProgressOverlay} from '@jahia/react-material';
import IconButton from '@material-ui/core/IconButton';
import {useQuery} from 'react-apollo-hooks';
import {translate} from 'react-i18next';
import {MediaPickerFilledQuery} from './MediaPicker_filled.gql-queries';
import {encodeJCRPath} from '../../../../EditPanel.utils';

const styles = theme => ({
    imageSelectedContainer: {
        height: theme.spacing.unit * 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // TODO border: `1px ${theme.palette.ui.zeta} solid`,
        border: '1px #C1C8D5 solid',
        borderRadius: '2px',
        paddingRight: theme.spacing.unit
    },
    imageSelectedImgContainer: {
        height: theme.spacing.unit * 9,
        width: theme.spacing.unit * 9,
        overflow: 'hidden',
        display: 'inline-block',
        padding: '2px',
        backgroundColor: theme.palette.ui.zeta
    },
    imageSelectedImg: {
        width: '100%',
        height: '100%',
        margin: 0,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
    },
    imageSelectedMetadata: {
        flexGrow: 1,
        padding: '1rem 2rem',
        width: 'calc(100% - 144px)',
        '& p': {
            width: '360px',
            padding: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    }
});

const MediaPickerFilledCmp = ({t, field, selectedImgId, classes}) => {
    const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
        variables: {
            uuid: selectedImgId
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
        imageData: {
            uuid: selectedImgId,
            url: `${window.contextJsParameters.contextPath}/files/default${encodeJCRPath(imageData.path)}`,
            name: imageData.name,
            size: [parseInt(imageData.height.value, 10), parseInt(imageData.width.value, 10)],
            weight: 1.2,
            type: imageData.children.nodes[0].mimeType.value
        }
    };

    return (
        <article className={classes.imageSelectedContainer} data-sel-media-picker="filled">
            <div className={classes.imageSelectedImgContainer}>
                <figure
                    className={classes.imageSelectedImg}
                    style={{backgroundImage: `url(${fieldData.imageData.url})`}}
                />
            </div>
            <div className={classes.imageSelectedMetadata}>
                <Typography data-sel-media-picker-name variant="zeta" color="alpha">
                    {fieldData.imageData.name}
                </Typography>
                <Typography data-sel-media-picker-info variant="omega" color="gamma">
                    {fieldData.imageData.type} - {fieldData.imageData.size[0]}x
                    {fieldData.imageData.size[1]}px - {fieldData.imageData.weight}mb
                </Typography>
            </div>
            <DisplayActions
                context={{field}}
                target="mediaPickerActions"
                render={({context}) => {
                    return (
                        <IconButton
                            data-sel-media-picker-action={context.actionKey}
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

MediaPickerFilledCmp.defaultProps = {
    classes: {}
};

MediaPickerFilledCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    selectedImgId: PropTypes.string.isRequired,
    classes: PropTypes.object
};

export const MediaPickerFilled = compose(
    translate(),
    withStyles(styles)
)(MediaPickerFilledCmp);

MediaPickerFilled.displayName = 'MediaPickerFilled';
