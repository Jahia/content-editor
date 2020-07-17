import {Button, IconButton} from '@jahia/design-system-kit';
import {withStyles} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import React from 'react';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import {connect, FastField, FieldArray} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

const styles = theme => {
    return {
        fieldComponentContainer: {
            display: 'flex',
            marginBottom: theme.spacing.unit,
            alignItems: 'center'
        },
        addButton: {
            margin: `${theme.spacing.unit * 2}px 0`,
            textTransform: 'uppercase'
        }
    };
};

export const MultipleFieldCmp = ({classes, editorContext, inputContext, field, onChange, formik: {values}}) => {
    const {t} = useTranslation();

    const multipleFieldOnChange = (index, newData) => {
        let updatedValues = [...values[field.name]];
        updatedValues[index] = newData;
        onChange(updatedValues);
    };

    const onFieldRemove = index => {
        let updatedValues = [...values[field.name]];
        updatedValues.splice(index, 1);
        onChange(updatedValues);
    };

    const onFieldAdd = () => {
        let updatedValues = values[field.name] ? [...values[field.name]] : [];
        const valueToAdd = field.requiredType === 'BOOLEAN' ? false : undefined;
        updatedValues.push(valueToAdd);
        onChange(updatedValues);
    };

    return (
        <>
            {values[field.name] && values[field.name].length > 0 && (
                values[field.name].map((value, index) => {
                    const FieldComponent = inputContext.fieldComponent;
                    const name = `${field.name}[${index}]`;

                    return (
                        <div key={name}
                             className={classes.fieldComponentContainer}
                             data-sel-content-editor-multiple-generic-field={name}
                             data-sel-content-editor-field-readonly={field.readOnly}
                        >
                            <FastField shouldUpdate={() => true}
                                       render={() => {
                                           return (
                                               <FieldComponent field={field}
                                                               value={value}
                                                               id={name}
                                                               editorContext={editorContext}
                                                               setActionContext={inputContext.setActionContext}
                                                               onChange={(newData) => {
                                                                   multipleFieldOnChange(index, newData);
                                                               }}
                                               />
                                           );
                                       }}
                            />

                            {!field.readOnly &&
                            <IconButton variant="ghost"
                                        data-sel-action={`removeField_${index}`}
                                        aria-label={t('content-editor:label.contentEditor.edit.fields.actions.clear')}
                                        icon={<Close/>}
                                        onClick={() => onFieldRemove(index)}
                            />}
                        </div>
                    );
                })
            )}

            {!field.readOnly &&
            <Button className={classes.addButton}
                    data-sel-action="addField"
                    variant="secondary"
                    onClick={() => onFieldAdd()}
            >
                {t('content-editor:label.contentEditor.edit.fields.actions.add')}
            </Button>}
        </>
    );
};

MultipleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const MultipleField = compose(
    connect,
    withStyles(styles)
)(MultipleFieldCmp);

MultipleField.displayName = 'MultipleField';
