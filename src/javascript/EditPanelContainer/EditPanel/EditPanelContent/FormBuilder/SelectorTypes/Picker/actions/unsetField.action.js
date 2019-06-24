export const unsetFieldAction = {
    init: context => {
        context.enabled = !context.field.formDefinition.readOnly;
    },
    onClick: context => {
        context.formik.setFieldValue(
            context.field.formDefinition.name,
            null,
            true
        );
    }
};
