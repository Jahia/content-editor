import {composeActions, componentRendererAction} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {withFormikAction} from '~/actions/withFormik.action';
import {reduxAction} from '~/actions/redux.action';
import {validateForm} from '~/Validation/validation.utils';

const mapStateToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    withFormikAction,
    componentRendererAction,
    reduxAction(mapStateToContext),
    {
        init: context => {
            context.enabled = context.mode === Constants.routes.baseEditRoute;

            if (context.enabled) {
                context.disabled = !context.formik.dirty;
            }

            context.addWarningBadge = Object.keys(context.formik.errors).length > 0;
        },
        onClick: ({formik, renderComponent}) => {
            if (!formik || !formik.dirty) {
                return;
            }

            const formIsValid = validateForm(formik, renderComponent);

            if (formIsValid) {
                formik
                    .submitForm()
                    .then(() => formik.resetForm(formik.values));
            }
        }
    });
