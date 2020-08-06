import {getFields} from '~/EditPanel/EditPanel.utils';
import {FieldConstraints} from './ChoiceList.gql-queries';

function getMixinList(field, fieldValue) {
    let mixins = [];

    const findAddMixin = value => field.valueConstraints
        ?.find(valueConstraint => valueConstraint.value.string === value)?.properties
        ?.find(property => property.name === 'addMixin')?.value;

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
                    // Set value to empty array in case of null to be consistent with old implementation.
                    context.push({
                        key: field.name,
                        value: currentValue === null ? [] : currentValue
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
                            dependentPropertiesField.readOnly = dependentPropertiesField.valueConstraints.length === 0;
                            editorContext.setSections([...editorContext.sections]);
                        }
                    });
                }
            });
        }
    });
};

export default registerChoiceListOnChange;
