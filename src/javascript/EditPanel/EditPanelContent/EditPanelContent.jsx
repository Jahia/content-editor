import React from 'react';
import {FullWidthContent, TwoColumnsContent} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import {compose} from '~/utils';
import {withStyles} from '@material-ui/core';
import {PreviewContainer} from './Preview';
import PublicationInfoProgress from '~/PublicationInfo/PublicationInfo.progress';
import {useContentEditorConfigContext} from '~/ContentEditor.context';

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

export const EditPanelContent = ({classes, isDirty}) => {
    const {mode} = useContentEditorConfigContext();
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
                            rightCol={<PreviewContainer isDirty={isDirty}/>}
                            data-sel-mode={mode}
                        >
                            <FormBuilder mode={mode}/>
                        </TwoColumnsContent>
                    </>
                )}
        </>
    );
};

EditPanelContent.defaultProps = {
    isDirty: false
};

EditPanelContent.propTypes = {
    classes: PropTypes.object.isRequired,
    isDirty: PropTypes.bool
};

export default compose(
    withStyles(styles)
)(EditPanelContent);
