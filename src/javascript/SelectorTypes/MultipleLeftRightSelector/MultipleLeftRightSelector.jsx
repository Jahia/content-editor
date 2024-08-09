import React, {useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {ListSelector} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';

const toArray = value => (Array.isArray(value) ? value : [value]);

const constraintsConsistentValues = (arrayValue, options) => {
    const availableValues = options.map(valueConstraint => valueConstraint.value);
    return arrayValue.filter(v => availableValues.includes(v));
};

export const MultipleLeftRightSelector = ({field, onChange, value}) => {
    const {t} = useTranslation('content-editor');
    const labelBase = 'label.contentEditor.picker.selectors.multipleLeftRightSelector';
    const arrayValue = useMemo(() => value ? toArray(value) : [], [value]);
    const options = field.valueConstraints.map(constraint => ({
        label: constraint.displayValue,
        value: constraint.value.string
    }));

    // Reset selection if previously selected option no longer available
    useEffect(() => {
        if (arrayValue && arrayValue.length > 0) {
            const actualValues = constraintsConsistentValues(arrayValue, options);
            if (actualValues.length !== arrayValue.length) {
                onChange(actualValues);
            }
        }
    }, [value, arrayValue, onChange, options]);  // eslint-disable-line

    if (arrayValue.length !== constraintsConsistentValues(arrayValue, options).length) {
        return null;
    }

    return (
        <ListSelector
            isReadOnly={field.readOnly || field.valueConstraints.length === 0}
            label={{
                addAllTitle: t(`${labelBase}.addAll`),
                removeAllTitle: t(`${labelBase}.removeAll`),
                selected: t(`${labelBase}.selected`, {count: arrayValue.length})
            }}
            values={arrayValue}
            options={options}
            onChange={onChange}
        />
    );
};

MultipleLeftRightSelector.propTypes = {
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOf([PropTypes.string, PropTypes.array])
};

export default MultipleLeftRightSelector;
