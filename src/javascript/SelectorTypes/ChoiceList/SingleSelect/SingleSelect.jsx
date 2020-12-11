import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {Dropdown} from '@jahia/moonstone';

const SingleSelect = ({field, value, id, setActionContext, onChange}) => {
    setActionContext({
        onChange
    });

    const readOnly = field.readOnly || field.valueConstraints.length === 0;
    const label = field.valueConstraints.find(item => item.value.string === value)?.displayValue || '';
    const dropdownData = field.valueConstraints.length > 0 ?
        field.valueConstraints.map(item => ({
            label: item.displayValue,
            value: item.value.string,
            attributes: {
                'data-value': item.value.string
            }
        })) :
        [{label: '', value: ''}];

    // Reset value if constraints doesnt contains the actual value.
    if (field.valueConstraints.find(v => v.value.string === value) === undefined) {
        onChange(null);
    }

    return (
        <Dropdown
            name={field.name}
            id={'select-' + id}
            data-sel-content-editor-select-readonly={readOnly}
            isDisabled={readOnly}
            maxWidth="100%"
            variant="outlined"
            size="medium"
            data={dropdownData}
            label={label}
            value={value}
            onChange={(evt, item) => {
                if (item.value !== value) {
                    onChange(item.value);
                }
            }}
        />
    );
};

SingleSelect.defaultProps = {
    value: ''
};

SingleSelect.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    setActionContext: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;
