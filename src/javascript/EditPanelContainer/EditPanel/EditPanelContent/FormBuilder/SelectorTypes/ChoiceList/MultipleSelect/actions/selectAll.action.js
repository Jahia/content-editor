export const selectAllAction = {
    init: context => {
        if (!context.field.formDefinition.multiple) {
            // This action should not be displayed for single choice list
            context.enabled = false;
            context.displayDisabled = false;
        } else {
            if (context.field.formDefinition.readOnly || !context.field.formDefinition.valueConstraints || context.field.formDefinition.valueConstraints.length === 0) {
                context.enabled = false;
                return;
            }

            context.mappedValueConstraints = context.field.formDefinition.valueConstraints.map(valueConstraint => valueConstraint.value.string);
            const values = context.formik.values[context.field.formDefinition.name];

            if (values && Array.isArray(values)) {
                context.enabled = !context.mappedValueConstraints.every(i => values.includes(i));
            }
        }
    },
    onClick: context => {
        context.formik.setFieldValue(
            context.field.formDefinition.name,
            context.mappedValueConstraints,
            true
        );
    }
};
