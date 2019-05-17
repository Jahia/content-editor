import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';

import {FieldPickerEmpty} from './FieldPicker_empty';
import {FieldPickerFilled} from './FieldPicker_filled';

const FieldPickerCmp = ({field, fieldData, id, editorContext, formik, picker}) => {
    if (!formik.values[field.formDefinition.name]) {
        return (
            <FieldPickerEmpty idInput={id}
                              readOnly={field.formDefinition.readOnly}
                              editorContext={editorContext}
                              picker={picker}
                              onSelection={item => {
                                  formik.setFieldValue(field.formDefinition.name, item[0].uuid, true);
                              }}
                              />
        );
    }

    return (
        <FieldPickerFilled field={field}
                           fieldData={fieldData}
                           selectedId={formik.values[field.formDefinition.name]}
                           id={id}/>
    );
};

FieldPickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    fieldData: PropTypes.shape({
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired

    }).isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    picker: PropTypes.func.isRequired
};

export const FieldPicker = connect(FieldPickerCmp);
