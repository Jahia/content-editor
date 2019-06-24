export const replaceAction = {
    init: context => {
        context.enabled = !context.field.formDefinition.readOnly;
    },
    onClick: context => {
        context.open(true);
    }
};
