export const replaceAction = {
    init: context => {
        context.enabled = !context.field.readOnly;
    },
    onClick: context => {
        if (context.enabled) {
            context.open(true);
        }
    }
};
