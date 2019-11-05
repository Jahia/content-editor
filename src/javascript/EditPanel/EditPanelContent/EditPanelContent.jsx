import React from 'react';
import {FullWidthContent, TwoColumnsContent} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import {PreviewContainer} from './PreviewContainer';
import PublicationInfoProgress from '../../PublicationInfo/PublicationInfo.progress';

const mapStateToProps = state => ({
    mode: state.mode
});

const styles = theme => ({
    twoColumnsRoot: {
        minHeight: 0,
        padding: 0
    },
    fullWidthRoot: {
        backgroundColor: theme.palette.ui.alpha,
        overflow: 'auto'
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

export const EditPanelContent = ({classes, mode, isDirty}) => {
    return (
        <>
            {mode === 'create' ?
                (
                    <FullWidthContent
                        classes={{root: classes.fullWidthRoot}}
                        data-sel-mode={mode}
                    >
                        <FormBuilder mode={mode}/>
                    </FullWidthContent>
                ) :
                (
                    <>
                        <PublicationInfoProgress/>
                        <TwoColumnsContent
                            classes={{root: classes.twoColumnsRoot, left: classes.left, right: classes.right}}
                            rightCol={<PreviewContainer isDirty={isDirty} mode={mode}/>}
                            data-sel-mode={mode}
                        >
                            <FormBuilder mode={mode}/>
                        </TwoColumnsContent>
                    </>
                )
            }
        </>
    );
};

EditPanelContent.defaultProps = {
    isDirty: false
};

EditPanelContent.propTypes = {
    classes: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    isDirty: PropTypes.bool
};

export default compose(
    translate(),
    withStyles(styles),
    connect(mapStateToProps)
)(EditPanelContent);
