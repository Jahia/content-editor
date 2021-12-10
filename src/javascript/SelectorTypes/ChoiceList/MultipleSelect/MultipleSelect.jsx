import React from 'react';
import {MultipleInput} from '~/DesignSystem/MultipleInput';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {DisplayAction} from "@jahia/ui-extender";
import {getButtonRenderer} from "../../../utils/getButtonRenderer";
import {connect} from "formik";

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

const MultipleSelectCmp = ({field, id, formik, value, inputContext, onChange}) => {
    inputContext.actionContext = {
        onChange
    };

    const options = field.valueConstraints.map(constraint => ({
        label: constraint.displayValue,
        value: constraint.value.string
    }));

    const readOnly = field.readOnly || field.valueConstraints.length === 0;
    // Reset value if constraints doesnt contains the actual value.
    if (value && value.length > 0) {
        const availableValues = field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
        const actualValues = value.filter(v => availableValues.includes(v));
        if (actualValues.length !== value.length) {
            onChange(actualValues);
        }
    }

    return (
        <div className="flexFluid flexRow alignCenter">
            <MultipleInput
                className="flexFluid"
                id={id}
                options={options}
                value={value && options.filter(data => value.includes(data.value))}
                readOnly={readOnly}
                inputProps={{
                    'data-sel-content-editor-select-readonly': readOnly
                }}
                onChange={selection => {
                    const newSelection = selection && selection.map(data => data.value);
                    onChange(newSelection);
                }}
            />
            {inputContext.displayActions && (
                <DisplayAction actionKey="content-editor/field/Choicelist"
                               formik={formik}
                               field={field}
                               inputContext={inputContext}
                               render={ButtonRenderer}
                />
            )}
        </div>
    );
};

MultipleSelectCmp.propTypes = {
    id: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    inputContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const MultipleSelect = connect(MultipleSelectCmp);
MultipleSelect.displayName = 'MultipleSelect';

export default MultipleSelect;
