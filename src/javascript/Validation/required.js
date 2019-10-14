import {getDynamicFieldSetOfField} from '~/EditPanelContainer/EditPanel/EditPanel.utils';

const requiredFieldValidation = (value, multiple) => {
    const error = 'required';

    // Check all case of not valid requirement (this to allow "false" as a valid value)
    if (value === undefined || value === null || value === '') {
        return error;
    }

    if (multiple && (value.length === 0 || value.filter(value => value !== '' && value !== undefined && value !== null).length === 0)) {
        return error;
    }
};

export const requiredValidation = sections => {
    return values => {
        return sections.reduce((errors, section) => {
            const fieldSetErrors = section.fieldSets.reduce((fieldSetErrors, fieldset) => {
                const fieldErrors = fieldset.fields.reduce((fieldErrors, field) => {
                    const dynamicFieldSet = getDynamicFieldSetOfField(sections, field.name);

                    if (!field.mandatory || (dynamicFieldSet.name && !values[dynamicFieldSet.name])) {
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
