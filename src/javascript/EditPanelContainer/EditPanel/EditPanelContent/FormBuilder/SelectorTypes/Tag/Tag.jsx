import {translate} from 'react-i18next';
import {MultipleInput} from '../../../../../../DesignSystem/MultipleInput';
import {Field} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '../../../../../FormDefinitions/FromData.proptypes';

const Tag = ({field, id, t}) => {
    const adaptOptions = options => (
        options.map(value => ({
            value: value,
            label: value
        }))
    );

    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                const formikField = props.field;

                const options = field.data && field.data.values && adaptOptions(field.data.values);

                return (
                    <MultipleInput
                        creatable
                        {...formikField}
                        id={id}
                        options={options}
                        value={
                            formikField.value && adaptOptions(formikField.value)
                        }
                        readOnly={field.formDefinition.readOnly}
                        placeholder={t('content-editor:label.contentEditor.edit.tagPlaceholder')}
                        formatCreateLabel={value => t('content-editor:label.contentEditor.edit.createTagPlaceholder', {tagName: value})}
                        onBlur={() => {
                            /* Do Nothing on blur BACKLOG-10095 */
                        }}
                        onChange={selection => {
                            const newSelection = selection && selection.map(data => data.value);
                            // eslint-disable-next-line react/prop-types
                            props.form.setFieldValue(field.formDefinition.name, newSelection, false);
                        }}
                    />
                );
            }}
        />
    );
};

Tag.propTypes = {
    id: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    field: FieldPropTypes.isRequired
};

export default translate()(Tag);
