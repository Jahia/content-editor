import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import PropTypes from 'prop-types';
import {Input} from '@jahia/design-system-kit';
import {FieldPropTypes} from '../../../../../../../../FormDefinitions/FormData.proptypes';

export const TextCmp = ({field, value, id, editorContext, formik: {handleChange}}) => {
    const fieldType = field.requiredType;
    const isNumber = fieldType === 'DOUBLE' || fieldType === 'LONG' || fieldType === 'DECIMAL';
    const decimalSeparator = editorContext.uiLang === 'en' ? '.' : ',';

    return (
        <Input
            fullWidth
            id={id}
            name={id}
            defaultValue={isNumber ? value && value.replace('.', decimalSeparator) : value}
            readOnly={field.readOnly}
            type={isNumber ? 'number' : 'text'}
            decimalScale={fieldType === 'LONG' ? 0 : undefined}
            decimalSeparator={decimalSeparator}
            onChange={handleChange}
        />
    );
};

TextCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired
};

const Text = compose(connect)(TextCmp);
Text.displayName = 'Text';
export default Text;
