export const replaceAction = {
    init: context => {
        context.enabled = !context.field.readOnly;
        context.key = 'replaceContent';
    },
    onClick: context => {
        if (context.enabled) {
            context.open(true);
        }
    }
};
