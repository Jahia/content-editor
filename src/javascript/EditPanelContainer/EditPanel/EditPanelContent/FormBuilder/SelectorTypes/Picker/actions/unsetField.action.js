export const unsetFieldAction = {
    onClick: context => {
        context.formik.setFieldValue(context.field.formDefinition.name, null, true);
    }
};
