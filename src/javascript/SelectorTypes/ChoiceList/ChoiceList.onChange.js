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
            let editorSection = editorContext.sections;

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
};

export default registerChoiceListOnChange;
