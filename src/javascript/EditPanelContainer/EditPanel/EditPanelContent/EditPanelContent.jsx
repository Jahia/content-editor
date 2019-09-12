import React, {useState} from 'react';
import {FullWidthContent, TwoColumnsContent} from '@jahia/design-system-kit';
import {Typography} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {PreviewContainer} from './PreviewContainer';
import {Details} from './Details';
import {Constants} from '~/ContentEditor.constants';

const mapStateToProps = state => ({
    mode: state.mode
});

const styles = theme => ({
    twoColumnsRoot: {
        minHeight: 0,
        padding: 0
    },
    fullWidthRoot: {
        backgroundColor: theme.palette.ui.alpha
    },
    right: {
        padding: 0,
        overflow: 'auto'
    },
    left: {
        overflow: 'auto',
        padding: 0
    },
    toggleButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '1rem'
    }
});

const SelectedTabComponents = {
    preview: PreviewContainer,
    details: Details
};

export const EditPanelContent = ({t, classes, isDirty, mode}) => {
    const [previewMode, setPreviewMode] = useState('preview');

    const SelectedTabComponent = SelectedTabComponents[previewMode];
    const PreviewCmp = mode === Constants.routes.baseEditRoute && SelectedTabComponent ?
        <SelectedTabComponent isDirty={isDirty}/> : null;

    return (
        <>
            <ToggleButtonGroup exclusive
                               value={previewMode}
                               className={classes.toggleButtons}
                               onChange={(_, mode) => {
                                   if (mode) {
                                       setPreviewMode(mode);
                                   }
                               }}
            >
                <ToggleButton value="preview">
                    <Typography variant="caption" color="inherit">
                        {t('content-editor:label.contentEditor.preview.toggleButtons.preview')}
                    </Typography>
                </ToggleButton>
                <ToggleButton value="details">
                    <Typography variant="caption" color="inherit">
                        {t('content-editor:label.contentEditor.preview.toggleButtons.details')}
                    </Typography>
                </ToggleButton>
                <ToggleButton value="off">
                    <Typography variant="caption" color="inherit">
                        {t('content-editor:label.contentEditor.preview.toggleButtons.off')}
                    </Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            {
                PreviewCmp ?
                    <TwoColumnsContent classes={{root: classes.twoColumnsRoot, left: classes.left, right: classes.right}}
                                       rightCol={PreviewCmp}
                    >
                        <FormBuilder/>
                    </TwoColumnsContent> :
                    <FullWidthContent classes={{root: classes.fullWidthRoot}}>
                        <FormBuilder/>
                    </FullWidthContent>
            }
        </>
    );
};

EditPanelContent.defaultProps = {
    isDirty: false
};

EditPanelContent.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    isDirty: PropTypes.bool
};

export default compose(
    translate(),
    withStyles(styles),
    connect(mapStateToProps)
)(EditPanelContent);
