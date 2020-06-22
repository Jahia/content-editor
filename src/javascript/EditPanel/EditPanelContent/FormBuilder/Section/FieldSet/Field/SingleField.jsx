import React, {useState, useEffect, useReducer} from 'react';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect, FastField} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

const reducer = (state, action) => {
    switch (action.type) {
        case 'set':
            return action.data;
        case 'unMount':
            return action.onChange(state, undefined);
        default:
            throw new Error();
    }
};

export const SingleFieldCmp = ({inputContext, field, onChange, formik}) => {
    const FieldComponent = inputContext.fieldComponent;
    const [isInit, setInit] = useState(false);

    const [previousValue, dispatch] = useReducer(reducer, undefined);

    useEffect(() => {
        return () => dispatch({type: 'unMount', onChange});
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
                           dispatch({type: 'set', data: newValue});
                           onChange(previousValue, newValue);
                       };

                       const singleFieldOnInit = data => {
                           if (!isInit) {
                               // Be careful with 'false' and '0' and '' that are considered as value
                               if (data !== null && data !== undefined) {
                                   dispatch({type: 'set', data});
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
