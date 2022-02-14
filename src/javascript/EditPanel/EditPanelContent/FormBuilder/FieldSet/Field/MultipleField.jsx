import {Button, Close} from '@jahia/moonstone';
import {withStyles} from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import {FastField, useFormikContext} from 'formik';
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

export const MultipleFieldCmp = ({classes, editorContext, inputContext, field, onChange}) => {
    const {values} = useFormikContext();
    const {t} = useTranslation('content-editor');

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
                            <FastField component={FieldComponent}
                                       field={field}
                                       value={value}
                                       values={values}
                                       id={name}
                                       editorContext={editorContext}
                                       inputContext={inputContext}
                                       onChange={newData => {
                                           multipleFieldOnChange(index, newData);
                                       }}
                            />

                            {!field.readOnly &&
                            <Button variant="ghost"
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
                    variant="outlined"
                    size="big"
                    label={t('content-editor:label.contentEditor.edit.fields.actions.add')}
                    onClick={() => onFieldAdd()}
            />}
        </>
    );
};

MultipleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const MultipleField = compose(
    withStyles(styles)
)(MultipleFieldCmp);

MultipleField.displayName = 'MultipleField';
