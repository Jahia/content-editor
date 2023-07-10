import {getFields} from '~/utils/fields.utils';
import {FieldConstraints} from './registerSelectorTypesOnChange.gql-queries';

function arrayEquals(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => {
        if (isObject(value)) {
            return JSON.stringify(value) === JSON.stringify(arr2[index]);
        }

        if (isArray(value)) {
            return arrayEquals(value, arr2[index]);
        }

        return value === arr2[index];
    });
}

const isObject = object => {
    return object !== null && typeof object === 'object';
};

const isArray = array => {
    return Array.isArray(array);
};

export const registerSelectorTypesOnChange = registry => {
    registry.add('selectorType.onChange', 'dependentProperties', {
        targets: ['*'],
        onChange: (previousValue, currentValue, field, onChangeContext) => {
            const sections = onChangeContext.sections;
            const fields = getFields(sections);
            const dependentPropertiesFields = fields
                .filter(f => f.selectorOptions
                    .find(s => s.name === 'dependentProperties' && s.value.includes(field.propertyName))
                );

            Promise.all(dependentPropertiesFields.map(dependentPropertiesField => {
                const dependentProperties = dependentPropertiesField.selectorOptions.find(f => f.name === 'dependentProperties').value.split(',');
                if (dependentProperties.length > 0) {
                    const context = [{
                        key: 'dependentProperties', value: dependentProperties.join(',')
                    }];

                    // Build Context
                    dependentProperties.filter(dependentProperty => dependentProperty !== field.propertyName).forEach(dependentProperty => {
                        const dependentField = fields.find(field => field.propertyName === dependentProperty);
                        if (dependentField) {
                            context.push({
                                key: dependentProperty,
                                value: onChangeContext.formik.values[dependentField.name]
                            });
                        }
                    });
                    // Set value to empty array in case of null to be consistent with old implementation.
                    context.push({
                        key: field.propertyName,
                        value: currentValue === null ? [] : currentValue
                    });

                    return onChangeContext.client.query({
                        query: FieldConstraints,
                        variables: {
                            uuid: onChangeContext.mode === 'create' ? null : onChangeContext.nodeData.uuid,
                            parentUuid: onChangeContext.mode === 'create' ? onChangeContext.nodeData.uuid : onChangeContext.nodeData.parent.uuid,
                            primaryNodeType: onChangeContext.mode === 'create' ? onChangeContext.nodeTypeName : onChangeContext.nodeData.primaryNodeType.name,
                            nodeType: dependentPropertiesField.nodeType,
                            fieldName: dependentPropertiesField.propertyName,
                            context: context,
                            uilang: onChangeContext.lang,
                            language: onChangeContext.lang
                        }
                    }).then(({data}) => ({
                        data,
                        dependentPropertiesField
                    }));
                }

                return undefined;
            })).then(results => {
                let updated = false;
                results.forEach(({data, dependentPropertiesField}) => {
                    if (data) {
                        if (data?.forms?.fieldConstraints) {
                            const fieldToUpdate = getFields(sections).find(f => f.name === dependentPropertiesField.name);
                            if (fieldToUpdate && !arrayEquals(fieldToUpdate.valueConstraints, data.forms.fieldConstraints)) {
                                // Update field in place (for those who keep a constant ref on sectionsContext)
                                fieldToUpdate.valueConstraints = data.forms.fieldConstraints;
                                // And recreate the full sections object to make change detection work
                                sections.forEach(section => {
                                    section.fieldSets = section.fieldSets.map(fieldSet => ({
                                        ...fieldSet,
                                        fields: fieldSet.fields.map(f => ({
                                            ...f
                                        }))
                                    }));
                                });
                                updated = true;
                            }
                        }
                    }
                });
                if (updated) {
                    onChangeContext.onSectionsUpdate();
                }
            });
        }
    });
};
