import {composeActions, componentRendererAction} from '@jahia/react-material';
import {withFormikAction} from '~/actions/withFormik.action';
import {validateForm} from '~/Validation/validation.utils';
import {withPublicationInfoContextAction} from '~/actions/withPublicationInfoContext.action';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    withFormikAction,
    componentRendererAction,
    withPublicationInfoContextAction,
    {
        init: context => {
            if (context.enabled) {
                context.disabled = !context.formik.dirty || context.publicationInfoContext.publicationInfoPolling;
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
