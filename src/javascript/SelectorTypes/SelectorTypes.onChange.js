import {getFields} from '~/EditPanel/EditPanel.utils';
import {FieldConstraints} from "~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/Field.gql-queries";

const registerSelectorTypesOnChange = registry => {
    // Todo: change target to '*' BACKLOG-14124
    registry.add('selectorType.onChange', 'dependentProperties', {
        targets: ['Choicelist'],
        onChange: (previousValue, currentValue, field, editorContext) => {
            const dependentPropertiesFields = getFields(editorContext.sections)
                .filter(f => f.selectorOptions
                    .find(s => s.name === 'dependentProperties' && s.value.includes(field.name))
                );

            dependentPropertiesFields.forEach(dependentPropertiesField => {
                const dependentProperties = dependentPropertiesField.selectorOptions.find(f => f.name === 'dependentProperties').value.split(',');
                if (dependentProperties.length > 0) {
                    const context = [{
                        key: 'dependentProperties', value: dependentProperties.join(',')
                    }];

                    // Build Context
                    dependentProperties.filter(dependentProperty => dependentProperty !== field.name).forEach(dependentProperty => context.push({
                        key: dependentProperty,
                        value: editorContext.formik.values[dependentProperty]
                    }));
                    context.push({
                        key: field.name,
                        value: currentValue
                    });

                    editorContext.client.query(
                        {
                            query: FieldConstraints,
                            variables: {
                                uuid: editorContext.nodeData.uuid,
                                parentUuid: editorContext.nodeData.parent.path,
                                primaryNodeType: editorContext.nodeData.primaryNodeType.name,
                                nodeType: dependentPropertiesField.nodeType,
                                fieldName: dependentPropertiesField.name,
                                context: context,
                                uilang: editorContext.lang,
                                language: editorContext.lang
                            }
                        }).then(data => {
                            if (data?.data?.forms?.fieldConstraints) {
                                dependentPropertiesField.valueConstraints = data.data.forms.fieldConstraints;
                                editorContext.setSections([...editorContext.sections]);
                            }
                    });
                }
            });
        }
    });
};

export default registerSelectorTypesOnChange;
