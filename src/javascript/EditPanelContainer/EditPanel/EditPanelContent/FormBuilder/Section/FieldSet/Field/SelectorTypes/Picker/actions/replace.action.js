export const replaceAction = {
    init: context => {
        context.enabled = !context.field.readOnly;
    },
    onClick: context => {
        context.open(true);
    }
};
