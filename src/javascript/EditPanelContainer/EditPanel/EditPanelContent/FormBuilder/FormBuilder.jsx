import React from 'react';

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography
} from '@jahia/ds-mui-theme';
import {connect} from 'formik';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import * as PropTypes from 'prop-types';
import {FormGroup, withStyles} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import EditNodeProperty from './EditNodeProperty';

let styles = theme => ({
    inputLabel: {
        color: theme.palette.font.alpha
    },
    formGroup: {
        width: '100%'
    },
    form: {}
});

export const FormBuilder = ({classes, fields, formik, siteInfo, editorContext}) => {
    // Get fields name
    let targetsName = new Set();
    fields.forEach(field => field.targets.forEach(target => targetsName.add(target.name)));
    return (
        <form className={classes.form} onSubmit={formik.handleSubmit}>
            {Array.from(targetsName).map((target, index) => {
                let fieldsByTarget = fields.filter(field => field.targets.filter(t => t.name === target).length > 0);
                return (
                    <ExpansionPanel key={target} variant="normal" defaultExpanded={index === 0} data-sel-content-editor-fields-group={target}>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            <Typography variant="epsilon" color="alpha">{target}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <FormGroup variant="normal" className={classes.formGroup}>
                                {fieldsByTarget.map(field => {
                                    return <EditNodeProperty key={field.formDefinition.name} field={field} siteInfo={siteInfo} editorContext={editorContext}/>;
                                })}
                            </FormGroup>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                );
            })}
        </form>
    );
};

FormBuilder.propTypes = {
    editorContext: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired
};

export default compose(
    translate(),
    withStyles(styles),
    connect
)(FormBuilder);
