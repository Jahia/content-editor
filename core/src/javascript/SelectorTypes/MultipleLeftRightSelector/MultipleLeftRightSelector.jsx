import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {ListSelector} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';

const toArray = value => (Array.isArray(value) ? value : [value]);

export const MultipleLeftRightSelector = ({field, onChange, value}) => {
    const {t} = useTranslation('content-editor');
    const labelBase = 'label.contentEditor.picker.selectors.multipleLeftRightSelector';
    const arrayValue = value ? toArray(value) : [];

    // Reset selection if previously selected option no longer available
    useEffect(() => {
        if (arrayValue && arrayValue.length > 0) {
            const availableValues = field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
            const actualValues = arrayValue.filter(v => availableValues.includes(v));
            if (actualValues.length !== arrayValue.length) {
                onChange(actualValues);
            }
        }
    }, [value, onChange]); // eslint-disable-line

    const options = field.valueConstraints.map(constraint => ({
        label: constraint.displayValue,
        value: constraint.value.string
    }));

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
