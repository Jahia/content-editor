import {extractRangeConstraints, getDynamicFieldSetNameOfField} from '~/utils';
import dayjs from '~/date.config';
import {Constants} from '~/ContentEditor.constants';

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

const colorFieldValidation = (values, field) => {
    if (field.selectorType === Constants.color.selectorType) {
        const fieldValues = Array.isArray(values[field.name]) ? values[field.name] : [values[field.name]];

        for (const fieldValue of fieldValues) {
            if (fieldValue && !Constants.color.hexColorRegexp.test(fieldValue)) {
                return Constants.color.errorCode;
            }
        }
    }

    return undefined;
};

const patternFieldValidation = (values, field) => {
    const error = 'invalidPattern';

    const constraints = field.valueConstraints && field.valueConstraints.map(constraint => constraint.value.string);

    // QA-14633: choicelist values are passed as value constraints, so we only need to do an equals comparison
    // instead of running the selector options through Regex.
    const strictValidation = field.selectorType === Constants.field.selectorType.CHOICELIST;

    if (constraints && constraints.length > 0 && field.requiredType === 'STRING') {
        const fieldValues = field.multiple ? (values[field.name] || []) : [values[field.name]];
        const constraintTestFn = (strictValidation) ?
            (constraint, value) => constraint === value :
            (constraint, value) => {
                // The regexp should always start and end with anchors to ensure that the full value respect the pattern.
                const cleanedConstraint = constraint.replace(/^\^|\$$/g, '');
                const regex = new RegExp(`^${cleanedConstraint}$`);
                return regex.test(String(value));
            };

        // If one pattern is invalid, error!
        if (fieldValues.some(value =>
            value &&
            constraints
                .map(constraint => constraintTestFn(constraint, value))
                .filter(value => value)
                .length === 0
        )) {
            return error;
        }
    }
};

const maxLengthFieldValidation = (values, field) => {
    const error = 'maxLength';
    let maxLength = field.selectorOptions;
    maxLength = maxLength && field.selectorOptions.find(entry => entry.name === 'maxLength');
    if (field.requiredType !== 'STRING' || !maxLength || !maxLength.value) {
        return;
    }

    const fieldValues = field.multiple ? (values[field.name] || []) : [values[field.name]];
    if (fieldValues.find(value => (value || '').length > maxLength.value)) {
        return error;
    }
};

const requiredFieldValidation = (values, field) => {
    const error = 'required';

    if (!field.mandatory) {
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

const systemNameValidation = (values, field) => {
    const regex = /[\\/:*?"<>|%]/;
    if (field.name === 'nt:base_ce:systemName' && regex.test(values[field.name])) {
        return 'invalidSystemName';
    }
};

export const validate = sections => {
    return values => {
        return sections.reduce((errors, section) => {
            const fieldSetErrors = section.fieldSets.reduce((fieldSetErrors, fieldset) => {
                const fieldErrors = fieldset.fields.reduce((fieldErrors, field) => {
                    // Do not validate field if it's dynamic and not enabled
                    const dynamicFieldSetName = getDynamicFieldSetNameOfField(sections, field);
                    if (dynamicFieldSetName && !values[dynamicFieldSetName]) {
                        return fieldErrors;
                    }

                    // Do the validation
                    const fieldError = (
                        requiredFieldValidation(values, field) ||
                        dateFieldValidation(values, field) ||
                        colorFieldValidation(values, field) ||
                        patternFieldValidation(values, field) ||
                        maxLengthFieldValidation(values, field) ||
                        systemNameValidation(values, field)
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
