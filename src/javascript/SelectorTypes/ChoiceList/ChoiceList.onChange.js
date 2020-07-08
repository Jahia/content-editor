import {getFields} from '~/EditPanel/EditPanel.utils';

function getMixinList(field, fieldValue) {
    let mixins = [];
    const findAddMixin = value => value?.properties.find(entry => entry.name === 'addMixin')?.value;
    if (field.multiple) {
        fieldValue.forEach(value => {
            const mixin = findAddMixin(value);
            if (mixin) {
                mixins.push(mixin);
            }
        });
    } else {
        const mixin = findAddMixin(fieldValue);
        if (mixin) {
            mixins.push(mixin);
        }
    }

    return mixins;
}

const registerChoiceListOnChange = registry => {
    registry.add('selectorType.onChange', 'addMixinChoicelist', {
        targets: ['Choicelist'],
        onChange: (previousValue, currentValue, field, editorContext, selectorType, helper) => {
            let editorSection = editorContext.getSections();

            let oldMixins = previousValue ? getMixinList(field, previousValue) : [];

            if (oldMixins.length === 0 && currentValue === undefined) {
                // If no mixin and no new value, do nothing
                return;
            }

            oldMixins.forEach(mixin => {
                editorSection = helper.moveMixinToInitialFieldset(mixin, editorSection, editorContext.formik);
            });

            let newMixins = currentValue ? getMixinList(field, currentValue) : [];
            newMixins.forEach(mixin => {
                editorSection = helper.moveMixinToTargetFieldset(mixin, field.nodeType, editorSection, field, editorContext.formik);
            });

            editorContext.setSections(editorSection);
        }
    });

    registry.add('selectorType.onChange', 'dependentProperties', {
        targets: ['Choicelist', 'Picker', 'Checkbox', 'DatePicker', 'DateTimePicker', 'RichText', 'TextArea', 'Text', 'Tag', 'Category'],
        onChange: (previousValue, currentValue, field, editorContext) => {
            const dependentPropertiesField = getFields(editorContext.sections)
                .find(f => f.selectorOptions
                    .find(s => s.name === 'dependentProperties' && s.value.includes(field.name))
                );

            if (dependentPropertiesField) {
                const dependentProperties = dependentPropertiesField.selectorOptions.find(f => f.name === 'dependentProperties');
                const values = dependentProperties.value.split(',');
                const value = currentValue.value.string;

                // Build context
                if (dependentPropertiesField.fieldDPContext) {
                    const contextEntry = dependentPropertiesField.fieldDPContext?.find(elem => elem.key === field.name);

                    if (contextEntry) {
                        contextEntry.value = [value];
                    } else {
                        dependentPropertiesField.fieldDPContext.push({key: field.name, value: [value]});
                    }
                } else {
                    dependentPropertiesField.fieldDPContext = [
                        {key: 'dependentProperties', value: values},
                        {key: field.name, value: [value]}
                    ];
                }
            }
        }
    });
};

export default registerChoiceListOnChange;
