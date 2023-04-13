import {Button} from '@jahia/moonstone';
import React from 'react';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {FastField, useFormikContext} from 'formik';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import styles from './MultipleField.scss';
import {OrderableValue} from '~/DesignSystem/OrderableValue/OrderableValue';

export const MultipleField = ({editorContext, inputContext, field, onChange, onBlur}) => {
    const {values, setFieldValue, setFieldTouched} = useFormikContext();
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
        onBlur();
    };

    const onFieldAdd = () => {
        let updatedValues = values[field.name] ? [...values[field.name]] : [];
        const valueToAdd = field.requiredType === 'BOOLEAN' ? false : undefined;
        updatedValues.push(valueToAdd);
        onChange(updatedValues);
        onBlur();
    };

    const onValueReorder = (droppedName, index) => {
        let childrenWithoutDropped = [];
        let droppedChild = null;
        let droppedItemIndex = -1;
        values[field.name].forEach((item, index) => {
            if (droppedItemIndex === -1 && droppedName === `${field.name}[${index}]`) {
                droppedChild = item;
                droppedItemIndex = index;
            } else {
                childrenWithoutDropped.push(item);
            }
        });

        if (droppedChild !== null && droppedItemIndex >= 0) {
            // +1 for droppedItemIndex here as index parameter from handleReOrder is starting from 1 instead of 0
            const spliceIndex = ((droppedItemIndex + 1) < index) ? index - 1 : index;
            const newValue = [...childrenWithoutDropped.slice(0, spliceIndex), droppedChild, ...childrenWithoutDropped.slice(spliceIndex, childrenWithoutDropped.length)];
            setFieldValue(field.name, newValue);
            setFieldTouched(field.name, true, false);
        }
    };

    return (
        <>
            <div className="flexFluid">
                {values[field.name] && values[field.name].length > 0 && (
                    values[field.name].map((value, index) => {
                        const FieldComponent = inputContext.selectorType.cmp;
                        const name = `${field.name}[${index}]`;

                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <OrderableValue key={`${field.name}_${index}`}
                                            component={<FastField component={FieldComponent}
                                                                  field={field}
                                                                  value={value}
                                                                  values={values}
                                                                  id={name}
                                                                  editorContext={editorContext}
                                                                  inputContext={inputContext}
                                                                  onChange={newData => {
                                                                      multipleFieldOnChange(index, newData);
                                                                  }}
                                                                  onBlur={onBlur}
                                            />}
                                            field={field}
                                            index={index}
                                            onFieldRemove={onFieldRemove}
                                            onValueReorder={onValueReorder}/>
                        );
                    })
                )}
                {values[field.name] && values[field.name].length > 0 && (
                    <OrderableValue field={field}
                                    index={values[field.name].length}
                                    onValueReorder={onValueReorder}/>
                )}
            </div>
            {!field.readOnly &&
            <Button className={styles.addButton}
                    data-sel-action="addField"
                    variant="outlined"
                    size="big"
                    label={t('content-editor:label.contentEditor.edit.fields.actions.add')}
                    onClick={() => onFieldAdd()}
            />}
        </>
    );
};

MultipleField.propTypes = {
    inputContext: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
