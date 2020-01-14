import {useTranslation} from 'react-i18next';
import {MultipleInput} from '~/DesignSystem/MultipleInput';
import {FastField} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import {adaptSelection} from './Tag.utils';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';

jest.mock('react-i18next');

const Tag = ({field, id}) => {
    const {t} = useTranslation();
    const adaptOptions = options => (
        options.map(data => ({
            value: data,
            label: data
        }))
    );

    const selectorOption = field.selectorOptions && field.selectorOptions.find(option => option.name === 'separator');
    const separator = selectorOption ? selectorOption.value : ',';

    return (
        <FastField
            name={field.name}
            render={({field: formikField, form: {setFieldValue, setFieldTouched}}) => {
                const options = field.data && field.data.values && adaptOptions(field.data.values);
                const setValue = selection => {
                    const newSelection = selection && selection.map(data => data.value);
                    const adaptedSelection = adaptSelection(newSelection, separator);

                    setFieldValue(field.name, adaptedSelection, true);
                    setFieldTouched(field.name, field.multiple ? [true] : true);
                };

                return (
                    <MultipleInput
                        creatable
                        {...formikField}
                        id={id}
                        options={options}
                        value={formikField.value && adaptOptions(formikField.value)}
                        readOnly={field.readOnly}
                        placeholder={t('content-editor:label.contentEditor.edit.tagPlaceholder')}
                        formatCreateLabel={value => t('content-editor:label.contentEditor.edit.createTagPlaceholder', {tagName: value})}
                        onBlur={() => {
                            /* Do Nothing on blur BACKLOG-10095 */
                        }}
                        onChange={setValue}
                    />
                );
            }}
        />
    );
};

Tag.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired
};

export default Tag;
