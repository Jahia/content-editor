import {getDynamicFieldSetOfField, extractRangeConstraints} from '~/EditPanel/EditPanel.utils';
import dayjs from '~/date.config';

const dateFieldValidation = (values, field) => {
    const error = 'invalidDate';

    if (field.requiredType !== 'DATE' || !values[field.name]) {
        return;
    }

    const fieldValues = Array.isArray(values[field.name]) ? values[field.name] : [values[field.name]];
    const fieldDates = fieldValues.map(date => dayjs(date));
    // If one date is invalid, error !
    if (fieldDates.some(date => !date.isValid())) {
        return error;
    }

    if (!field.valueConstraints || field.valueConstraints.length === 0) {
        return;
    }

    const respectEachConstraint = field.valueConstraints
        .map(constraint => {
            try {
                const {lowerBoundary, disableLowerBoundary, upperBoundary, disableUpperBoundary} = extractRangeConstraints(constraint.value.string);

                return fieldDates
                    .every(fieldDate => {
                        // Lower boundary Check
                        if (lowerBoundary &&
                            !fieldDate[disableLowerBoundary ? 'isAfter' : 'isSameOrAfter'](lowerBoundary)
                        ) {
                            return false;
                        }

                        // Upper boundary Check
                        if (upperBoundary &&
                            !fieldDate[disableUpperBoundary ? 'isBefore' : 'isSameOrBefore'](upperBoundary)
                        ) {
                            return false;
                        }

                        return true;
                    });
            } catch (e) {
                // In case we cannot read the constraint
                console.error(e);
                return true;
            }
        })
        .some(isConstraintRespected => isConstraintRespected === true);
        // To explain why it's a some in the line above :
        // https://docs.adobe.com/docs/en/spec/jcr/2.0/3_Repository_Model.html#3.7.3.6%20Value%20Constraints

    return respectEachConstraint ? undefined : error;
};

const patternFieldValidation = (values, field) => {
    const error = 'invalidPattern';

    const constraints = field.valueConstraints && field.valueConstraints.map(constraint => constraint.value.string);

    if (constraints && constraints.length > 0 && field.requiredType === 'STRING') {
        const fieldValues = field.multiple ? values[field.name] : [values[field.name]];

        // If one pattern is invalid, error!
        if (fieldValues.some(value =>
            value &&
            constraints
                .map(constraint => RegExp(constraint).test(String(value)))
                .filter(value => value)
                .length === 0
        )) {
            return error;
        }
    }
};

const requiredFieldValidation = (values, field, dynamicFieldSet) => {
    const error = 'required';

    if (!field.mandatory || (dynamicFieldSet.name && !values[dynamicFieldSet.name])) {
        return;
    }

    const value = values[field.name];
    // Check all case of not valid requirement (this to allow "false" as a valid value)
    if (value === undefined || value === null || value === '') {
        return error;
    }

    if (field.multiple && (value.length === 0 || value.filter(value => value !== '' && value !== undefined && value !== null).length === 0)) {
        return error;
    }
};

export const validate = sections => {
    return values => {
        return sections.reduce((errors, section) => {
            const fieldSetErrors = section.fieldSets.reduce((fieldSetErrors, fieldset) => {
                const fieldErrors = fieldset.fields.reduce((fieldErrors, field) => {
                    const dynamicFieldSet = getDynamicFieldSetOfField(sections, field.name);

                    const fieldError = (
                        requiredFieldValidation(values, field, dynamicFieldSet) ||
                        dateFieldValidation(values, field) ||
                        patternFieldValidation(values, field)
                    );

                    if (fieldError) {
                        fieldErrors[field.name] = fieldError;
                    }

                    return fieldErrors;
                }, {});

                return {
                    ...fieldSetErrors,
                    ...fieldErrors
                };
            }, {});

            return {
                ...errors,
                ...fieldSetErrors
            };
        }, {});
    };
};
