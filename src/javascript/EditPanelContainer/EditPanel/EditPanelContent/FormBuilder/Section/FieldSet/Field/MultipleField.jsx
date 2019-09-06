import {IconButton} from '@jahia/design-system-kit';
import {withStyles} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import React from 'react';
import * as PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {connect, FieldArray} from 'formik';
import {FieldPropTypes} from '../../../../../../FormDefinitions';

const styles = theme => {
    return {
        fieldComponentContainer: {
            display: 'flex',
            marginBottom: theme.spacing.unit
        }
    };
};

export const MultipleFieldCmp = ({classes, t, inputContext, field, formik: {values}}) => {
    return (
        <FieldArray
            name={field.name}
            render={arrayHelpers => (
                <>
                    {values[field.name] && values[field.name].length > 0 && (
                        values[field.name].map((value, index) => {
                            const FieldComponent = inputContext.fieldComponent;
                            const name = `${field.name}[${index}]`;

                            return (
                                <div key={name} className={classes.fieldComponentContainer}>
                                    <FieldComponent field={field}
                                                    value={value}
                                                    id={name}
                                                    editorContext={inputContext.editorContext}
                                                    setActionContext={inputContext.setActionContext}
                                    />

                                    <IconButton variant="ghost"
                                                data-sel-action="removeField"
                                                aria-label={t('content-editor:label.contentEditor.edit.fields.actions.clear')}
                                                icon={<Close/>}
                                                onClick={() => {
                                                    arrayHelpers.remove(index);
                                                }}
                                    />
                                </div>
                            );
                        })
                    )}

                    <button type="button" onClick={() => arrayHelpers.push('')}>
                        {/* TODO BACKLOG-11022 finish add button */}
                        Add
                    </button>
                </>
            )}
        />
    );
};

MultipleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

export const MultipleField = compose(
    connect,
    translate(),
    withStyles(styles)
)(MultipleFieldCmp);

MultipleField.displayName = 'MultipleField';
