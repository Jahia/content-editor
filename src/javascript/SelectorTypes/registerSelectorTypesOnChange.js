import {getFields} from '~/utils/fields.utils';
import {FieldConstraints} from './registerSelectorTypesOnChange.gql-queries';

export const registerSelectorTypesOnChange = registry => {
    registry.add('selectorType.onChange', 'dependentProperties', {
        targets: ['*'],
        onChange: (previousValue, currentValue, field, onChangeContext) => {
            const {sections, setAddedConstraints, formik} = onChangeContext;
            const fields = getFields(sections);
            const dependentPropertiesFields = fields
                .filter(f => f.selectorOptions
                    .find(s => s.name === 'dependentProperties' && s.value.includes(field.propertyName))
                );

            // Store timestamp to ensure that we keep latest promise resolution
            const now = Date.now();

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
                                value: formik.values[dependentField.name]
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
                results.forEach(({data, dependentPropertiesField}) => {
                    if (data) {
                        if (data?.forms?.fieldConstraints) {
                            setAddedConstraints(prev => !prev[dependentPropertiesField.name] || prev[dependentPropertiesField.name].ts < now ? {
                                ...prev,
                                [dependentPropertiesField.name]: {
                                    field: dependentPropertiesField,
                                    constraints: data.forms.fieldConstraints,
                                    ts: now
                                }
                            } : prev);
                        }
                    }
                });
            });
        }
    });
};
