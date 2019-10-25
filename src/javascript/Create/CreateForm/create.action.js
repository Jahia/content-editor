import {composeActions, componentRendererAction} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import {Constants} from '~/ContentEditor.constants';
import {reduxAction} from '~/actions/redux.action';
import {validateForm} from '~/Validation/validation.utils';

const stateMapToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    withFormikAction,
    componentRendererAction,
    reduxAction(stateMapToContext),
    {
        init: context => {
            context.enabled = context.mode === Constants.routes.baseCreateRoute;
            context.addWarningBadge = Object.keys(context.formik.errors).length > 0;
        },
        onClick: async ({formik, renderComponent}) => {
            if (!formik) {
                return;
            }

            const formIsValid = await validateForm(formik, renderComponent);

            if (formIsValid) {
                return formik
                    .submitForm()
                    .then(() => {
                        formik.resetForm(formik.values);
                    });
            }
        }
    }
);
