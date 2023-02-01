import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
import {Dropdown} from '@jahia/moonstone';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

export const MultipleSelect = ({field, id, value, inputContext, onChange, onBlur}) => {
    inputContext.actionContext = {
        onChange,
        onBlur
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
            <Dropdown hasSearch
                      className="flexFluid"
                      id={id}
                      variant="outlined"
                      data={options}
                      values={value || []}
                      isDisabled={readOnly}
                      data-sel-content-editor-select-readonly={readOnly}
                      onChange={(_, selectedValue) => {
                          const prev = value || [];
                          onChange(prev.indexOf(selectedValue.value) > -1 ? prev.filter(i => i !== selectedValue.value) : [...prev, selectedValue.value]);
                      }}
                      onBlur={onBlur}
            />
            {inputContext.displayActions && (
                <DisplayAction actionKey="content-editor/field/Choicelist"
                               field={field}
                               inputContext={inputContext}
                               render={ButtonRenderer}
                />
            )}
        </div>
    );
};

MultipleSelect.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    inputContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

