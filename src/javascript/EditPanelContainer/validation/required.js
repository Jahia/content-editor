export const requiredFieldValidation = value => {
    return value ? undefined : 'required';
};

export const requiredValidation = sections => {
    return values => {
        const errors = sections.reduce((errors, section) => {
            const fieldSetErrors = section.fieldSets.reduce((fieldSetErrors, fieldset) => {
                const fieldErrors = fieldset.fields.reduce((fieldErrors, field) => {
                    if (!field.mandatory || field.requiredType === 'BOOLEAN') {
                        return fieldErrors;
                    }

                    const fieldError = requiredFieldValidation(values[field.name]);
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
