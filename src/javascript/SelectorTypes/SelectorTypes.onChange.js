import {getFields} from '~/EditPanel/EditPanel.utils';
import {FieldConstraints} from '~/SelectorTypes/ChoiceList/ChoiceList.gql-queries';

const registerSelectorTypesOnChange = registry => {
    registry.add('selectorType.onChange', 'dependentProperties', {
        targets: ['*'],
        onChange: (previousValue, currentValue, field, editorContext) => {
            const sections = [...editorContext.getSections()];
            const fields = getFields(sections);
            const dependentPropertiesFields = fields
                .filter(f => f.selectorOptions
                    .find(s => s.name === 'dependentProperties' && s.value.includes(field.propertyName))
                );

            dependentPropertiesFields.forEach(async dependentPropertiesField => {
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
                                value: editorContext.formik.values[dependentField.name]
                            });
                        }
                    });
                    // Set value to empty array in case of null to be consistent with old implementation.
                    context.push({
                        key: field.propertyName,
                        value: currentValue === null ? [] : currentValue
                    });

                    const {data} = await editorContext.client.query(
                        {
                            query: FieldConstraints,
                            variables: {
                                uuid: editorContext.nodeData.uuid,
                                parentUuid: editorContext.nodeData.parent.path,
                                primaryNodeType: editorContext.nodeData.primaryNodeType.name,
                                nodeType: dependentPropertiesField.nodeType,
                                fieldName: dependentPropertiesField.propertyName,
                                context: context,
                                uilang: editorContext.lang,
                                language: editorContext.lang
                            }
                        });
                    if (data) {
                        if (data?.forms?.fieldConstraints) {
                            // As fields might have changed in the time of the await, get them back from contextSection
                            const newSections = [...editorContext.getSections()];
                            const newField = getFields(newSections).find(field => field.name === dependentPropertiesField.name);
                            if (newField) {
                                newField.valueConstraints = data.forms.fieldConstraints;
                                editorContext.setSections(newSections);
                            }
                        }
                    }
                }
            });
        }
    });
};

export default registerSelectorTypesOnChange;
