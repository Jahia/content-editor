
function getMixinList(field, fieldValue) {
    let mixins = [];
    if (field.multiple) {
        fieldValue.forEach(value => {
            const property = value?.properties.find(entry => entry.name === 'addMixin');
            const mixin = property ? property.value : null;
            mixins.push(mixin);
        });
    } else {
        const property = fieldValue?.properties.find(entry => entry.name === 'addMixin');
        const mixin = property ? property.value : null;
        mixins.push(mixin);
    }

    return mixins;
}

const registerChoiceListOnChange = registry => {
    registry.add('selectorType.onChange', 'addMixinChoicelist', {
        targets: ['Choicelist'],
        onChange: (previousValue, currentValue, field, editorContext, selectorType, helper) => {
            let editorSection = editorContext.sections;

            let oldMixins = previousValue ? getMixinList(field, previousValue) : [];

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
};

export default registerChoiceListOnChange;
