import {getFields} from '~/EditPanel/EditPanel.utils';

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
                        value: currentValue?.value?.string // Todo: We read the value only for choiceList, make it more generic BACKLOG-14124
                    });

                    const callback = valueConstraints => {
                        dependentPropertiesField.valueConstraints = valueConstraints;
                        // Sync editor context with updated sections.
                        editorContext.setSections(editorContext.sections);
                    };

                    editorContext.fieldRefreshes[dependentPropertiesField.name](context, callback);
                }
            });
        }
    });
};

export default registerSelectorTypesOnChange;
