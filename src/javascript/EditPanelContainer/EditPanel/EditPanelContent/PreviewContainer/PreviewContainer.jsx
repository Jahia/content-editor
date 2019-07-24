import {Badge, Paper, Typography} from '@jahia/design-system-kit';
import {Grid, withStyles} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import React from 'react';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {useContentEditorContext} from '../../../ContentEditor.context';
import {ContentPreviewMemoWrapper} from './Preview';

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
        marginBottom: theme.spacing.unit * 2
    }
});

const PreviewContainerCmp = ({classes, t, isDirty}) => {
    const workspace = 'EDIT';
    const editorContext = useContentEditorContext();
    return (
        <Paper className={classes.contentPaper}>
            <Grid container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className={classes.preview}
            >
                <Grid item>
                    <Typography variant="epsilon" color="alpha">
                        {t('content-editor:label.contentEditor.preview.toggleButtons.preview')}
                    </Typography>
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
            <ContentPreviewMemoWrapper path={editorContext.path} lang={editorContext.lang} workspace={workspace}/>
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
