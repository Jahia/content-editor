export const requiredFieldValidation = (value, multiple) => {
    const error = 'required';

    if (!value) {
        return error;
    }

    if (multiple && (value.length === 0 || value.filter(value => value !== '' && value !== undefined).length === 0)) {
        return error;
    }
};

export const requiredValidation = sections => {
    return values => {
        return sections.reduce((errors, section) => {
            const fieldSetErrors = section.fieldSets.reduce((fieldSetErrors, fieldset) => {
                const fieldErrors = fieldset.fields.reduce((fieldErrors, field) => {
                    if (!field.mandatory || (!field.multiple && field.requiredType === 'BOOLEAN')) {
                        return fieldErrors;
                    }

                    const fieldError = requiredFieldValidation(values[field.name], field.multiple);
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
