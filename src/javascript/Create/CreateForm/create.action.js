import {composeActions, componentRendererAction} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {validateForm} from '~/Validation/validation.utils';

export default composeActions(
    componentRendererAction,
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
