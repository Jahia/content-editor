import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Toggle, Typography} from '@jahia/design-system-kit';
import {compose} from '~/utils';
import {FieldSetPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FieldContainer} from './Field';
import {useFormikContext} from 'formik';

let styles = theme => ({
    fieldsetContainer: {},
    fieldsetTitleContainer: {
        borderTop: `1px solid ${theme.palette.ui.omega}`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: '74px',
        margin: `0 ${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 4}px`
    },
    labelContainer: {
        display: 'flex',
        flexFlow: 'column wrap'
    },
    fieldSetTitle: {
        width: 'auto',
        textTransform: 'uppercase',
        padding: `${theme.spacing.unit * 2}px 0`
    },
    fieldSetDescription: {
        paddingBottom: `${theme.spacing.unit * 2}px`,
        marginTop: `${-theme.spacing.unit}px`
    }
});

const MemoizedFieldContainer = React.memo(FieldContainer);

const DynamicFieldSet = ({fieldset, classes}) => {
    const {values, handleChange} = useFormikContext();
    const activatedFieldSet = (values && values[fieldset.name]);
    return (
        <article className={classes.fieldsetContainer}>
            <div className={classes.fieldsetTitleContainer}>
                <Toggle data-sel-role-dynamic-fieldset={fieldset.name}
                        id={fieldset.name}
                        checked={activatedFieldSet}
                        readOnly={fieldset.readOnly}
                        onChange={handleChange}
                />

                <div className={classes.labelContainer}>
                    <Typography component="label" htmlFor={fieldset.name} className={classes.fieldSetTitle}
                                color="alpha" variant="zeta">
                        {fieldset.displayName}
                    </Typography>
                    {fieldset.description &&
                    <Typography component="label" className={classes.fieldSetDescription} color="beta" variant="omega">
                        {fieldset.description}
                    </Typography>}
                </div>
            </div>

            {activatedFieldSet && fieldset.fields.map(field => <MemoizedFieldContainer key={field.name} field={field}/>)}
        </article>
    );
}

const StaticFieldSet = ({fieldset, classes}) => {
    return (
        <article className={classes.fieldsetContainer}>
            <div className={classes.fieldsetTitleContainer}>
                <div className={classes.labelContainer}>
                    <Typography component="label" htmlFor={fieldset.name} className={classes.fieldSetTitle}
                                color="alpha" variant="zeta">
                        {fieldset.displayName}
                    </Typography>
                    {fieldset.description &&
                    <Typography component="label" className={classes.fieldSetDescription} color="beta" variant="omega">
                        {fieldset.description}
                    </Typography>}
                </div>
            </div>

            {fieldset.fields.map(field => <FieldContainer key={field.name} field={field}/>)}
        </article>
    );
}

const FieldSetCmp = ({fieldset, classes}) => {
    return fieldset.dynamic ? (
        <DynamicFieldSet fieldset={fieldset} classes={classes}/>
    ) : (
        <StaticFieldSet fieldset={fieldset} classes={classes}/>
    )
};

FieldSetCmp.propTypes = {
    fieldset: FieldSetPropTypes.isRequired,
    classes: PropTypes.object.isRequired
};

export const FieldSet = compose(
    withStyles(styles)
)(FieldSetCmp);

FieldSet.displayName = 'FieldSet';
