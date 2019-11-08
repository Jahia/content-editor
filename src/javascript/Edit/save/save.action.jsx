import {composeActions, componentRendererAction} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {withFormikAction} from '~/actions/withFormik.action';
import {validateForm} from '~/Validation/validation.utils';

export default composeActions(
    withFormikAction,
    componentRendererAction,
    {
        init: context => {
            context.enabled = context.mode === Constants.routes.baseEditRoute;

            if (context.enabled) {
                context.disabled = !context.formik.dirty;
            }

            context.addWarningBadge = Object.keys(context.formik.errors).length > 0;
        },
        onClick: async ({formik, renderComponent}) => {
            if (!formik || !formik.dirty) {
                return;
            }

            const formIsValid = await validateForm(formik, renderComponent);

            if (formIsValid) {
                return formik
                    .submitForm()
                    .then(() => formik.resetForm(formik.values));
            }
        }
    });
