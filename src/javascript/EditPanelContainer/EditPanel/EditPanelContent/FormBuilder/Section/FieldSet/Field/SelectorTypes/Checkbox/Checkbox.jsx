import React from 'react';
import * as PropTypes from 'prop-types';
import {Toggle} from '@jahia/design-system-kit';
import {FieldPropTypes} from '../../../../../../../../FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';

const Checkbox = ({field, value, id}) => {
    return (
        <FastField render={({form: {setFieldValue, setFieldTouched}}) => {
            const handleChange = (event, checked) => {
                setFieldValue(id, checked);
                setFieldTouched(id, field.multiple ? [true] : true);
            };

            return (
                <Toggle id={id}
                        inputProps={{
                            'aria-labelledby': `${field.name}-label`
                        }}
                        checked={value === true}
                        readOnly={field.readOnly}
                        onChange={handleChange}
                />
);
        }}/>
    );
};

Checkbox.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool
};

export default Checkbox;
