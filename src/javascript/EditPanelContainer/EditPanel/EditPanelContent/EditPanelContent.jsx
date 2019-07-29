import React from 'react';
import {TwoColumnsContent} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {FieldsPropTypes} from '../../FormDefinitions/';
import {PreviewContainer} from './PreviewContainer';

const styles = theme => ({
    twoColumnsRoot: {
        minHeight: 0
    },
    fullWidthRoot: {
        backgroundColor: theme.palette.ui.alpha,
        padding: (theme.spacing.unit * 4) + 'px ' + (theme.spacing.unit * 4) + 'px 0'
    },
    fullWidthForm: {
        overflow: 'auto'
    },
    left: {
        overflow: 'auto'
    },
    toggleButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '1rem'
    }
});

export const EditPanelContent = ({classes, fields, siteInfo, isDirty}) => {
    return (
        <TwoColumnsContent classes={{root: classes.twoColumnsRoot, left: classes.left, right: classes.right}}
                           rightCol={<PreviewContainer isDirty={isDirty}/>}
        >
            <FormBuilder fields={fields} siteInfo={siteInfo}/>
        </TwoColumnsContent>
    );
};

EditPanelContent.defaultProps = {
    isDirty: false
};

EditPanelContent.propTypes = {
    fields: FieldsPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired,
    isDirty: PropTypes.bool
};

export default compose(
    withStyles(styles)
)(EditPanelContent);
