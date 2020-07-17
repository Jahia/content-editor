
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

        }
    });
};

export default registerChoiceListOnChange;
