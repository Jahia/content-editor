import EditPanelConstants from './EditPanelConstants';
import * as _ from 'lodash';

function isSystemField(fieldKey) {
    return fieldKey in EditPanelConstants.systemFields;
}

function getPropertiesToSave(formValues, fields, lang) {
    return _.map(_.filter(_.keys(formValues), key => !isSystemField(key)), key => {
        let field = _.find(fields, {formDefinition: {name: key}});
        return {
            name: key,
            type: field.jcrDefinition.requiredType,
            value: formValues[key],
            language: lang
        };
    });
}

export {
    isSystemField,
    getPropertiesToSave
};
