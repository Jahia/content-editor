import {composeActions} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {withFormikAction} from '~/actions/withFormik.action';
import {reduxAction} from '~/actions/redux.action';

const mapStateToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    withFormikAction,
    reduxAction(mapStateToContext),
    {
        init: context => {
            context.enabled = context.mode === Constants.routes.baseEditRoute;

            context.addWarningBadge = Object.keys(context.formik.errors).length > 0;
        },
        onClick: ({formik}) => {
            if (!formik || !formik.dirty) {
                return;
            }

            const {submitForm, resetForm, setFieldValue} = formik;

            setFieldValue(
                Constants.editPanel.OPERATION_FIELD,
                Constants.editPanel.submitOperation.SAVE,
                false
            );

            submitForm()
                .then(() => resetForm(formik.values));
        }
    });
