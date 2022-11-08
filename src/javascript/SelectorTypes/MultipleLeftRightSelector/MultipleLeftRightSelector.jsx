import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ValueList from '~/SelectorTypes/MultipleLeftRightSelector/ValueList';
import {ChevronLeft, ChevronRight, ChevronDoubleLeft, ChevronDoubleRight, Button, Input} from '@jahia/moonstone';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import styles from './MultipleLeftRightSlector.scss';

const toArray = value => (Array.isArray(value) ? value : [value]);

export const MultipleLeftRightSelector = ({field, onChange, value}) => {
    const [filterLeft, setFilterLeft] = useState(null);
    const [filterRight, setFilterRight] = useState(null);
    const [selectionLeft, setSelectionLeft] = useState([]);
    const [selectionRight, setSelectionRight] = useState([]);

    const arrayValue = value ? toArray(value) : [];
    const handleOnChange = v => {
        if (field.multiple) {
            onChange(v);
        } else {
            onChange(v[0]);
        }

        setSelectionRight([]);
        setSelectionLeft([]);
    };

    // Reset selection if previously selected option no longer available
    useEffect(() => {
        if (arrayValue && arrayValue.length > 0) {
            const availableValues = field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
            const actualValues = arrayValue.filter(v => availableValues.includes(v));
            if (actualValues.length !== arrayValue.length) {
                handleOnChange(actualValues);
            }
        }
    }, [value, onChange]); // eslint-disable-line

    const options = field.valueConstraints.map(constraint => ({
        label: constraint.displayValue,
        value: constraint.value.string
    }));

    const readOnly = field.readOnly || field.valueConstraints.length === 0;

    return (
        <div className={styles.multipleSelector}>
            <div className={styles.listHolder}>
                <Input variant="search"
                       onChange={e => setFilterLeft(e.target.value.trim())}
                />
                <ValueList isMultiple={field.multiple}
                           filter={filterLeft}
                           values={options.filter(o => !arrayValue.includes(o.value))}
                           selected={selectionLeft}
                           onSelect={s => setSelectionLeft(s)}
                />
            </div>
            <div className={styles.buttonSection}>
                <div className={styles.buttons}>
                    <Button title="Add all"
                            isDisabled={readOnly || !field.multiple}
                            icon={<ChevronDoubleRight/>}
                            onClick={() => handleOnChange(options.map(o => o.value))}
                    />
                    <Button title="Add selected"
                            isDisabled={readOnly || (!field.multiple && arrayValue.length > 0) || selectionLeft.length === 0}
                            icon={<ChevronRight/>}
                            onClick={() => handleOnChange(arrayValue.concat(selectionLeft))}
                    />
                    <Button title="Remove selected"
                            isDisabled={readOnly || selectionRight.length === 0}
                            icon={<ChevronLeft/>}
                            onClick={() => handleOnChange(arrayValue.filter(v => !selectionRight.includes(v)))}
                    />
                    <Button title="Remove all"
                            isDisabled={readOnly || !field.multiple}
                            icon={<ChevronDoubleLeft/>}
                            onClick={() => handleOnChange([])}
                    />
                </div>
            </div>
            <div className={styles.listHolder}>
                <Input variant="search"
                       onChange={e => setFilterRight(e.target.value.trim())}
                />
                <ValueList isMultiple
                           values={options.filter(o => arrayValue.includes(o.value))}
                           filter={filterRight}
                           selected={selectionRight}
                           onSelect={s => setSelectionRight(s)}
                />
            </div>
        </div>
    );
};

MultipleLeftRightSelector.propTypes = {
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOf([PropTypes.string, PropTypes.array])
};

export default MultipleLeftRightSelector;
