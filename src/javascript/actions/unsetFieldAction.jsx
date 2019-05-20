import {composeActions, actionsRegistry} from '@jahia/react-material';

export const unsetFieldAction = composeActions('unsetFieldAction', actionsRegistry.get('withFormikAction'), {
    init: context => {
        context.enabled = !context.field.formDefinition.readOnly;
    },
    onClick: context => {
        context.formik.setFieldValue(context.field.formDefinition.name, null, true);
    }
});
