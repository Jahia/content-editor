import {Badge, Paper, Typography} from '@jahia/design-system-kit';
import {Grid, withStyles} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Constants} from '~/ContentEditor.constants';
import {ContentPreviewMemoWrapper} from './Preview';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';

const styles = theme => ({
    contentPaper: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        minWidth: 0,
        paddingTop: theme.spacing.unit * 5,
        backgroundColor: theme.palette.ui.alpha
    },
    badge: {
        margin: 0
    },
    preview: {
        marginBottom: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * -3
    },
    toggleButtons: {
        boxShadow: 'none'
    },
    buttonRoot: {
        margin: 0,
        backgroundColor: theme.palette.ui.alpha + ' !important',
        borderBottomStyle: 'solid',
        borderBottomWidth: 2,
        borderBottomColor: theme.palette.common.white,
        '&:hover': {
            borderBottomColor: theme.palette.border.main
        }
    },
    buttonLabel: {},
    buttonSelected: {
        borderBottomColor: theme.palette.primary.main + ' !important'
    }
});

const SelectedTabComponents = {
    preview: ContentPreviewMemoWrapper
};

const PreviewContainerCmp = ({classes, isDirty, mode}) => {
    const {t} = useTranslation();
    const [previewMode, setPreviewMode] = useState(mode === Constants.routes.baseEditRoute ? 'preview' : null);

    const SelectedTabComponent = SelectedTabComponents[previewMode];
    const PreviewCmp = mode === Constants.routes.baseEditRoute && SelectedTabComponent ?
        <SelectedTabComponent isDirty={isDirty}/> : null;

    const toggleButtonClasses = {
        root: classes.buttonRoot,
        selected: classes.buttonSelected
    };

    return (
        <Paper className={classes.contentPaper}>
            <Grid container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className={classes.preview}
            >
                <Grid item>
                    <ToggleButtonGroup exclusive
                                       value={previewMode}
                                       className={classes.toggleButtons}
                                       onChange={(_, mode) => {
                                           if (mode) {
                                               setPreviewMode(mode);
                                           }
                                       }}
                    >
                        <ToggleButton value="preview" classes={toggleButtonClasses}>
                            <Typography id="preview-tab">
                                {t('content-editor:label.contentEditor.preview.toggleButtons.preview')}
                            </Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                {isDirty &&
                <Grid item>
                    <Badge className={classes.badge}
                           badgeContent={t('content-editor:label.contentEditor.preview.updateOnSave')}
                           variant="normal"
                           color="info"
                    />
                </Grid>}
            </Grid>
            {PreviewCmp}
        </Paper>
    );
};

PreviewContainerCmp.defaultProps = {
    isDirty: false
};

PreviewContainerCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    isDirty: PropTypes.bool
};

export const PreviewContainer = withStyles(styles)(PreviewContainerCmp);
PreviewContainer.displayName = 'PreviewContainer';
