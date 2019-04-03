import EditPanelConstants from './EditPanelConstants';
import * as _ from 'lodash';

function isSystemField(fieldKey) {
    return fieldKey in EditPanelConstants.systemFields;
}

function getPropertiesToSave(formValues, fields, lang) {
    const keys = _.filter(_.keys(formValues), key => !isSystemField(key));
    const filteredFields = _.filter(fields, field => !field.formDefinition.readOnly);

    return _.compact(_.map(keys, key => {
        let field = _.find(filteredFields, {formDefinition: {name: key}});
        return field ? {
            name: key,
            type: field.jcrDefinition.requiredType,
            value: formValues[key],
            language: lang
        } : null;
    }));
}

export {
    isSystemField,
    getPropertiesToSave
};
