import React from 'react';
import * as PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {connect, FieldArray} from 'formik';
import {FieldPropTypes} from '../../../../../../FormDefinitions';

export const MultipleFieldCmp = ({inputContext, field, formik: {values}}) => {
    return (
        <FieldArray
            name={field.name}
            render={arrayHelpers => (
                <div>
                    {values[field.name] && values[field.name].length > 0 && (
                        values[field.name].map((value, index) => {
                            const FieldComponent = inputContext.fieldComponent;
                            const name = `${field.name}[${index}]`;

                            return (
                                <div key={name}>
                                    <FieldComponent field={field}
                                                    value={value}
                                                    id={name}
                                                    editorContext={inputContext.editorContext}
                                                    setActionContext={inputContext.setActionContext}/>
                                </div>
                            );
                        })
                    )}

                    <button type="button" onClick={() => arrayHelpers.push('')}>
                        {/* TODO finish add button */}
                        Add
                    </button>
                </div>
            )}
    />
    );
};

MultipleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired
};

export const MultipleField = compose(
    connect,
    translate()
)(MultipleFieldCmp);

MultipleField.displayName = 'MultipleField';
