
export const registerAddMixin = registry => {
    registry.add('selectorType.onChange', 'addMixinChoicelist', {
        targets: ['Choicelist'],
        onChange: (previousValue, currentValue, field, editorContext, selectorType, helper) => {
            const property = previousValue?.properties.find(entry => entry.name === 'addMixin');
            const previousMixin = property ? property.value : null;
            let editorSection = editorContext.sections;
            if (previousMixin) {
                editorSection = helper.moveMixinToInitialFieldset(previousMixin, editorContext.sections, editorContext.formik);
            }

            const currentValueProperty = currentValue?.properties.find(entry => entry.name === 'addMixin');
            const addedMixin = currentValueProperty?.value;
            if (addedMixin) {
                editorSection = helper.moveMixinToTargetFieldset(addedMixin, field.nodeType, editorSection, field, editorContext.formik);
            }

            editorContext.setSections(editorSection);
        }
    });
};
