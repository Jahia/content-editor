export const unsetFieldAction = {
    init: context => {
        const value = context.formik.values[context.field.formDefinition.name];
        context.enabled = Boolean(!context.field.formDefinition.readOnly && (
            Array.isArray(value) ? value && value.length !== 0 : value
        ));
    },
    onClick: context => {
        context.formik.setFieldValue(
            context.field.formDefinition.name,
            null,
            true
        );
    }
};
