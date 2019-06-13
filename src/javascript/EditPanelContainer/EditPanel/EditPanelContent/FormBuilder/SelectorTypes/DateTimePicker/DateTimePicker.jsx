import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'formik';

import {DatePickerInput} from '../../../../../../DesignSystem/DatePickerInput';
import {extractRangeConstraints} from '../../../../EditPanel.utils';
import dayjs from 'dayjs';

const variantMapper = {
    DatePicker: 'date',
    DateTimePicker: 'datetime'
};

export const DateTimePicker = ({id, field, editorContext}) => {
    const displayDateFormat = field.formDefinition.selectorOptions.find(option => option.name === 'format');
    const variant = variantMapper[field.formDefinition.selectorType];
    const disabledDays = [];
    if (field.formDefinition.valueConstraints && field.formDefinition.valueConstraints.length > 0) {
        const constraints = extractRangeConstraints(field.formDefinition.valueConstraints[0].value.string);
        let lowerBoundary = constraints.lowerBoundary;
        let disabledBoundaries = {};
        if (lowerBoundary && lowerBoundary.length > 0) {
            disabledBoundaries.before = {
                date: new Date(lowerBoundary),
                include: constraints.disableLowerBoundary
            };
        }

        let upperBoundary = constraints.upperBoundary;
        if (upperBoundary && upperBoundary.length > 0) {
            disabledBoundaries.after = {
                date: new Date(upperBoundary),
                include: constraints.disableUpperBoundary
            };
        }

        disabledDays.push(disabledBoundaries);
    }

    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                // Remove onChange from props pass to the input component as it is set in it.
                const {value, onChange, ...formikField} = props.field;
                  return (
                      <DatePickerInput
                        dayPickerProps={{disabledDays}}
                        lang={editorContext.lang}
                        initialValue={value ? dayjs(value).toDate() : value}
                        onChange={
                            date => {
                                // TODO: QA-11925 - save date in ISO format without timezone
                                // eslint-disable-next-line
                                props.form.setFieldValue(field.formDefinition.name, date, true);
                            }
                        }
                        {...formikField}
                        displayDateFormat={displayDateFormat && displayDateFormat.value}
                        readOnly={field.formDefinition.readOnly}
                        variant={variant}
                        id={id}
                    />
                );
            }}
        />
    );
};

DateTimePicker.propTypes = {
    id: PropTypes.string.isRequired,
    editorContext: PropTypes.shape({
        lng: PropTypes.string
    }).isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired,
            selectorOptions: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.string
            })).isRequired
        }).isRequired
    }).isRequired
};
