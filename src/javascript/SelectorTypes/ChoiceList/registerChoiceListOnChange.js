function getMixinList(field, fieldValue) {
    const mixins = [];

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

export const registerChoiceListOnChange = registry => {
    registry.add('selectorType.onChange', 'addMixinChoicelist', {
        targets: ['Choicelist', 'MultipleLeftRightSelector'],
        onChange: (previousValue, currentValue, field, onChangeContext) => {
            const {setAddedMixins, formik} = onChangeContext;
            const oldMixins = previousValue ? getMixinList(field, previousValue) : [];

            if (oldMixins.length === 0 && currentValue === undefined) {
                // If no mixin and no new value, do nothing
                return;
            }

            oldMixins.forEach(mixin => {
                setAddedMixins(prev => {
                    const {[mixin]: _, ...rest} = prev;
                    return rest;
                });
                formik.setFieldValue(mixin, false);
                formik.setFieldTouched(mixin);
            });

            const newMixins = currentValue ? getMixinList(field, currentValue) : [];
            newMixins.forEach(mixin => {
                setAddedMixins(prev => ({
                    ...prev,
                    [mixin]: {targetFieldSet: field.nodeType, field}
                }));
                formik.setFieldValue(mixin, true);
                formik.setFieldTouched(mixin);
            });
        }
    });
};
