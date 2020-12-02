
/**
 * This function get the full name of a language by his id
 *
 * @param languages list of available languages
 * @param id language id to get
 * @returns the display name of a language
 */
export function getFullLanguageName(languages, id) {
    return languages.find(language =>
        language.language === id
    ).displayName;
}

/**
 * This function get the internationalized fields and their associated values from a form
 * @param formAndData form and values of a node
 * @returns The internationalized field and their values
 */
// TODO: https://jira.jahia.org/browse/TECH-301 we should use the Edit.adapter.js getFieldValues, because some field require adaptation before injected in the form
export function getI18nFieldAndValues(formAndData) {
    const {forms, jcr} = formAndData.data;
    let i18nFields = forms.editForm.sections
        .flatMap(section => section.fieldSets)
        .flatMap(fieldSet => fieldSet.fields)
        .filter(field => field.i18n)
        .map(field => {
            return {
                name: field.name,
                multiple: field.multiple
            };
        });

    return jcr.result.properties
        .filter(property => i18nFields.map(field => field.name).indexOf(property.name) > -1)
        .map(property => {
            return {
                ...property,
                multiple: i18nFields.find(field => field.name === property.name).multiple
            };
        });
}
