import {composeActions} from '@jahia/react-material';
import {withFormikAction} from '../../../../../../actions/withFormikAction';

export const mediaPickerUnsetAction = composeActions(withFormikAction, {
    onClick: context => {
        context.formik.setFieldValue(context.field.formDefinition.name, null, true);
    }
});
