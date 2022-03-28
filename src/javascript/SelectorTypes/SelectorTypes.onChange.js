import {getFields} from '~/EditPanel/EditPanel.utils';
import {FieldConstraints} from '~/SelectorTypes/ChoiceList/ChoiceList.gql-queries';

function arrayEquals(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

const registerSelectorTypesOnChange = registry => {
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
                            uuid: onChangeContext.nodeData.uuid,
                            parentUuid: onChangeContext.nodeData.parent.path,
                            primaryNodeType: onChangeContext.nodeData.primaryNodeType.name,
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
                                // Update field in place (for those who keep an constant ref on sectionsContext)
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

export default registerSelectorTypesOnChange;
