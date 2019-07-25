import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';

import {FieldSetPropTypes} from '../../../../../FormDefinitions/FormData.proptypes';
import {FieldContainer} from './Field';

let styles = theme => ({
    fieldsetContainer: {
    },
    fieldSetTitle: {
        borderTop: `1px solid ${theme.palette.ui.omega}`,
        padding: `${theme.spacing.unit * 2}px 0`,
        margin: `0 ${theme.spacing.unit * 4}px`
    }
});

const FieldSetCmp = ({fieldset, classes}) => {
    return (
        <article className={classes.fieldsetContainer}>
            <Typography className={classes.fieldSetTitle} color="alpha" variant="zeta">{fieldset.displayName}</Typography>
            {fieldset.fields.map(field => {
                return <FieldContainer key={field.displayName} field={field}/>;
            })}
        </article>
    );
};

FieldSetCmp.propTypes = {
    fieldset: FieldSetPropTypes.isRequired,
    classes: PropTypes.object.isRequired
};

export const FieldSet = withStyles(styles)(FieldSetCmp);
FieldSet.displayName = 'FieldSet';
