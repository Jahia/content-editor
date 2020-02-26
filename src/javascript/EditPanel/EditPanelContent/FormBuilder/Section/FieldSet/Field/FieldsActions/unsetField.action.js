export const unsetFieldAction = {
    init: context => {
        const value = context.formik.values[context.field.name];
        context.enabled = Boolean(!context.field.readOnly && (
            Array.isArray(value) ? value && value.length !== 0 : value
        ));
    },
    onClick: context => {
        if (context.enabled) {
            context.formik.setFieldValue(
                context.field.name,
                null,
                true
            );
            context.formik.setFieldTouched(context.field.name);
        }
    }
};
