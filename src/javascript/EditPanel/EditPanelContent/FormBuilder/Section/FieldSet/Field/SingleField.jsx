import React, {useState, useEffect, useRef} from 'react';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect, FastField} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

export const SingleFieldCmp = ({inputContext, editorContext, field, formik, onChange}) => {
    const FieldComponent = inputContext.fieldComponent;
    const [isInit, setInit] = useState(false);
    const currentValue = useRef(undefined);

    const unMount = () => {
        onChange(currentValue.current, undefined, editorContext);
    };

    useEffect(() => {
        return unMount;
    }, []);

    return (
        <FastField shouldUpdate={() => true}
                   render={({form: {setFieldValue, setFieldTouched}}) => {
                       const value = formik.values[field.name];

                       const singleFieldOnChange = (newData, transformOnChangeNewValue, transformBeforeSave) => {
                           // Save value to formik
                           const valueToSave = transformBeforeSave ? transformBeforeSave(newData) : newData;
                           setFieldValue(field.name, valueToSave, true);
                           setFieldTouched(field.name, field.isMultiple ? [true] : true);

                           // Handle onChange
                           const newValue = transformOnChangeNewValue ? transformOnChangeNewValue(newData) : newData;
                           onChange(currentValue.current, newValue, editorContext);
                           currentValue.current = newValue;
                       };

                       const singleFieldOnInit = data => {
                           if (!isInit) {
                               // Be careful with 'false' and '0' and '' that are considered as value
                               if (data !== null && data !== undefined) {
                                   onChange(undefined, data, editorContext);
                                   currentValue.current = data;
                               }

                               setInit(true);
                           }
                       };

                       return (
                           <FieldComponent field={field}
                                           id={field.name}
                                           value={value}
                                           editorContext={editorContext}
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
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const SingleField = compose(
    connect
)(SingleFieldCmp);

SingleField.displayName = 'SingleField';
