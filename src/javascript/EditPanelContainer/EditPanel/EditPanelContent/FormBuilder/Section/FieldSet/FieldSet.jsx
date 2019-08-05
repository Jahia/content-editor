import {connect} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';
import {compose} from 'react-apollo';
import {Toggle} from '../../../../../../DesignSystem/Toggle';
import {useContentEditorContext} from '../../../../../ContentEditor.context';

import {FieldSetPropTypes} from '../../../../../FormDefinitions/FormData.proptypes';

import {FieldContainer} from './Field';

let styles = theme => ({
    fieldsetContainer: {},
    fieldSetTitle: {
        width: 'auto',
        textTransform: 'uppercase',
        padding: `${theme.spacing.unit * 2}px 0`
    },
    fieldsetTitleContainer: {
        borderTop: `1px solid ${theme.palette.ui.omega}`,
        display: 'flex',
        flexDirection: 'row',
        margin: `0 ${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 4}px`
    }
});

const FieldSetCmp = ({fieldset, classes, formik: {values, handleChange}}) => {
    const isDynamicFieldSet = fieldset.dynamic;
    const activatedFieldSet = (values && values[fieldset.name]) || !isDynamicFieldSet;
    const context = useContentEditorContext();

    const isUnderMetadataSection = fieldName => {
        return context.sections
            .find(section => section.name === 'metadata')
            .fieldSets
            .reduce((result, fieldSet) => {
                const fieldSetsToHide = [];

                if (fieldSet.fields.find(field => field.name === fieldName)) {
                    fieldSetsToHide.push(fieldSet);
                }

                return [...result, ...fieldSetsToHide];
            }, []);
    };

    return (
        <article className={classes.fieldsetContainer}>
            <div className={classes.fieldsetTitleContainer}>
                {isDynamicFieldSet &&
                <Toggle id={fieldset.name}
                        checked={activatedFieldSet}
                        onChange={handleChange}
                />}

                <Typography component="h3" className={classes.fieldSetTitle} color="alpha" variant="zeta">
                    {fieldset.displayName}
                </Typography>
            </div>

            {activatedFieldSet && fieldset.fields.map(field => {
                if (isUnderMetadataSection(field.name) && field.readOnly) {
                    return null;
                }

                return <FieldContainer key={field.name} field={field}/>;
            })}
        </article>
    );
};

FieldSetCmp.propTypes = {
    fieldset: FieldSetPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

export const FieldSet = compose(
    connect,
    withStyles(styles)
)(FieldSetCmp);

FieldSet.displayName = 'FieldSet';
