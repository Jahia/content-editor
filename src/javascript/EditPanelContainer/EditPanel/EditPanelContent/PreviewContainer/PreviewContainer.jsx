import {Badge, Paper, Typography} from '@jahia/design-system-kit';
import {ContentPreview} from '@jahia/react-apollo';
import {PreviewComponent} from '@jahia/react-material';
import {Grid, withStyles} from '@material-ui/core';
import {connect} from 'formik';
import * as PropTypes from 'prop-types';
import React from 'react';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {setPreviewRefetcher} from '../../../EditPanel.refetches';

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

const PreviewContainerCmp = ({t, classes, formik, editorContext}) => {
    const workspace = 'EDIT';

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

                {formik.dirty &&
                <Grid item>
                    <Badge className={classes.badge}
                           badgeContent={t('content-editor:label.contentEditor.preview.updateOnSave')}
                           variant="normal"
                           color="info"
                    />
                </Grid>
                }
            </Grid>

            <ContentPreview path={editorContext.path}
                            language={editorContext.lang}
                            workspace={workspace}
                            templateType="html"
                            view="cm"
                            contextConfiguration="preview"
                            fetchPolicy="network-only"
                            setRefetch={refetchingData => setPreviewRefetcher(refetchingData)}
            >
                {data => <PreviewComponent data={data.jcr ? data.jcr : {}} workspace={workspace}/>}
            </ContentPreview>
        </Paper>
    );
};

PreviewContainerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

export const PreviewContainer = compose(
    translate(),
    withStyles(styles),
    connect
)(PreviewContainerCmp);

export {PreviewContainer};
