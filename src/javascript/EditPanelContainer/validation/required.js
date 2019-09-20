export const requiredFieldValidation = value => {
    return value ? undefined : 'required';
};

export const requiredValidation = sections => {
    return values => {
        const errors = sections.reduce((errors, section) => {
            const fieldSetErrors = section.fieldSets.reduce((fieldSetErrors, fieldset) => {
                const fieldErrors = fieldset.fields.reduce((fieldErrors, field) => {
                    if (!field.mandatory || (!field.multiple && field.requiredType === 'BOOLEAN')) {
                        return fieldErrors;
                    }

                    let value = values[field.name];
                    if (field.multiple) {
                        value = values[field.name] && values[field.name]
                            .filter(value => value !== '' && value !== undefined)
                            .length > 0;
                    }

                    const fieldError = requiredFieldValidation(value);
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

        return errors;
    };
};
