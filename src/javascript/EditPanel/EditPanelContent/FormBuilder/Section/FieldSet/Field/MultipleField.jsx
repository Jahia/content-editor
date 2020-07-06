import {Button, IconButton} from '@jahia/design-system-kit';
import {withStyles} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import React, {useState, useEffect, useRef} from 'react';
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
    const [isInit, setInit] = useState(false);
    const currentValue = useRef(undefined);
    const [data, setData] = useState(values[field.name] ? new Array(values[field.name].length) : []);
    const setCurrentValue = data => {
        currentValue.current = data;
        setData(currentValue.current);
    };

    useEffect(() => {
        return () => onChange(_mapDataForOnChange(currentValue.current), undefined, editorContext);
    }, []);

    const _mapDataForOnChange = dataToMap => {
        return dataToMap.filter(item => item.data !== undefined).map(item => item.data);
    };

    const _replaceData = (index, dataToReplace) => {
        data[index] = {
            data: dataToReplace
        };
        setCurrentValue(data);
    };

    const _addData = dataToAdd => {
        data.push({
            data: dataToAdd
        });
        setCurrentValue(data);
    };

    const _removeData = index => {
        data.splice(index, 1);
        setCurrentValue(data);
    };

    const multipleFieldOnInit = (initData, index) => {
        if (!isInit) {
            if (data[index] === undefined) {
                _replaceData(index, initData);
                if (!data.includes(undefined)) {
                    setInit(true);
                    onChange(undefined, _mapDataForOnChange(data), editorContext);
                }
            }
        }
    };

    const multipleFieldOnChange = (index, name, newData, transformOnChangeNewValue, transformOnChangePreviousValue, transformBeforeSave, setFieldValue, setFieldTouched) => {
        // Save value to formik
        const valueToSave = transformBeforeSave ? transformBeforeSave(newData) : newData;
        setFieldValue(name, valueToSave, true);
        setFieldTouched(field.name, [true]);

        // Handle onChange
        const previousValue = data.slice();
        _replaceData(index, transformOnChangeNewValue ? transformOnChangeNewValue(newData) : newData);
        onChange(_mapDataForOnChange(previousValue), _mapDataForOnChange(data), editorContext);
    };

    const onFieldRemove = (index, arrayHelpers) => {
        // Remove from formik
        arrayHelpers.remove(index);

        // Handle onChange
        const previousValue = data.slice();
        _removeData(index);
        if (previousValue[index].data !== undefined) {
            onChange(_mapDataForOnChange(previousValue), data.length ? _mapDataForOnChange(data) : undefined, editorContext);
        }
    };

    const onFieldAdd = arrayHelpers => {
        // Add in formik
        const valueToAdd = field.requiredType === 'BOOLEAN' ? false : undefined;
        arrayHelpers.push(valueToAdd);

        // Handle onChange
        const previousValue = data.slice();
        _addData(valueToAdd);
        if (valueToAdd !== undefined) {
            onChange(_mapDataForOnChange(previousValue), _mapDataForOnChange(data), editorContext);
        }
    };

    return (
        <FieldArray
            name={field.name}
            render={arrayHelpers => {
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
                                                   render={({form: {setFieldValue, setFieldTouched}}) => {
                                                       return (
                                                           <FieldComponent field={field}
                                                                           value={value}
                                                                           id={name}
                                                                           editorContext={editorContext}
                                                                           setActionContext={inputContext.setActionContext}
                                                                           onChange={(newData, transformOnChangeNewValue, transformOnChangePreviousValue, transformBeforeSave) => {
                                                                               multipleFieldOnChange(
                                                                                   index,
                                                                                   name,
                                                                                   newData,
                                                                                   transformOnChangeNewValue,
                                                                                   transformOnChangePreviousValue,
                                                                                   transformBeforeSave,
                                                                                   setFieldValue,
                                                                                   setFieldTouched);
                                                                           }}
                                                                           onInit={initData => {
                                                                               multipleFieldOnInit(initData, index);
                                                                           }}
                                                                           onDestroy={() => {
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
                                                    onClick={() => onFieldRemove(index, arrayHelpers)}
                                        />}
                                    </div>
                                );
                            })
                        )}

                        {!field.readOnly &&
                        <Button className={classes.addButton}
                                data-sel-action="addField"
                                variant="secondary"
                                onClick={() => onFieldAdd(arrayHelpers)}
                        >
                            {t('content-editor:label.contentEditor.edit.fields.actions.add')}
                        </Button>}
                    </>
                );
            }}
        />
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
