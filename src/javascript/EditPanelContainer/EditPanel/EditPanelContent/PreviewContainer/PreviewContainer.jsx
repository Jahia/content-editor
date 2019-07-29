import {Badge, Paper, Typography} from '@jahia/design-system-kit';
import {Grid, withStyles} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React, {useState} from 'react';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {useContentEditorContext} from '../../../ContentEditor.context';
import {ContentPreviewMemoWrapper} from './Preview';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Details} from './Details';

const styles = theme => ({
    contentPaper: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        minWidth: 0
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
        backgroundColor: theme.palette.common.white + ' !important',
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
    },
    ButtonDisabled: {
    }
});

const SelectedTabComponents = {
    preview: ContentPreviewMemoWrapper,
    details: Details
};

const PreviewContainerCmp = ({classes, t, isDirty}) => {
    const [previewMode, setPreviewMode] = useState('preview');
    const workspace = 'EDIT';
    const editorContext = useContentEditorContext();

    const toggleButtonClasses = {
        root: classes.buttonRoot,
        selected: classes.buttonSelected

    };

    const SelectedTabComponent = SelectedTabComponents[previewMode];
    const PreviewCmp = SelectedTabComponent ?
        <SelectedTabComponent path={editorContext.path} lang={editorContext.lang} workspace={workspace}/> : null;

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
                        <ToggleButton value="preview"
                                      classes={toggleButtonClasses}
                        >
                            <Typography>
                                {t('content-editor:label.contentEditor.preview.toggleButtons.preview')}
                            </Typography>
                        </ToggleButton>
                        <ToggleButton value="details"
                                      classes={toggleButtonClasses}
                        >
                            <Typography>
                                {t('content-editor:label.contentEditor.preview.toggleButtons.details')}
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
                </Grid>
                }
            </Grid>
            {PreviewCmp}
        </Paper>
    );
};

PreviewContainerCmp.defaultProps = {
    isDirty: false
};

PreviewContainerCmp.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isDirty: PropTypes.bool
};

export const PreviewContainer = compose(
    translate(),
    withStyles(styles)
)(PreviewContainerCmp);

PreviewContainer.displayName = 'PreviewContainer';
