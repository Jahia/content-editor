import {composeActions} from '@jahia/react-material';
import {withFormikAction} from './withFormikAction';

export const unsetFieldAction = composeActions(withFormikAction, {
    init: context => {
        context.enabled = !context.field.formDefinition.readOnly;
    },
    onClick: context => {
        context.formik.setFieldValue(context.field.formDefinition.name, null, true);
    }
});
