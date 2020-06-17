import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect, FastField} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

export const SingleFieldCmp = ({inputContext, field, onChange, formik}) => {
    const FieldComponent = inputContext.fieldComponent;
    const [isInit, setInit] = useState(false);

    return (
        <FastField shouldUpdate={() => true}
                   render={({form: {setFieldValue, setFieldTouched}}) => {
                       const value = formik.values[field.name];

                       const singleFieldOnChange = (newData, transformOnChangeNewValue, transformOnChangePreviousValue, transformBeforeSave) => {
                           // Save value to formik
                           const valueToSave = transformBeforeSave ? transformBeforeSave(newData) : newData;
                           setFieldValue(field.name, valueToSave, true);
                           setFieldTouched(field.name, field.isMultiple ? [true] : true);

                           // Handle onChange
                           const previousValue = transformOnChangePreviousValue ? transformOnChangePreviousValue(value) : value;
                           const newValue = transformOnChangeNewValue ? transformOnChangeNewValue(newData) : newData;
                           onChange(previousValue, newValue);
                       };

                       const singleFieldOnInit = data => {
                           if (!isInit) {
                               // Be careful with 'false' and '0' and '' that are considered as value
                               if (data !== null && data !== undefined) {
                                   onChange(undefined, data);
                               }

                               setInit(true);
                           }
                       };

                       return (
                           <FieldComponent field={field}
                                           id={field.name}
                                           value={value}
                                           editorContext={inputContext.editorContext}
                                           setActionContext={inputContext.setActionContext}
                                           onChange={singleFieldOnChange}
                                           onInit={singleFieldOnInit}
                           />
                       );
                   }}
        />
    );
};

SingleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const SingleField = compose(
    connect
)(SingleFieldCmp);

SingleField.displayName = 'SingleField';
