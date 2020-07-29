import {SaveErrorModal} from './SaveModal/SaveErrorModal';

const setErrorFieldTouched = (errorsFields, setTouched) => {
    const fieldsTouched = Object.keys(errorsFields).reduce((touched, field) => {
        return {
            ...touched,
            [field]: true
        };
    }, {});
    return setTouched(fieldsTouched);
};

export const validateForm = async ({setTouched, validateForm}, componentRenderer) => {
    const errors = await validateForm();
    // SetEach values touched to display errors if there is so.
    // If no error, form will be reset after submition
    await setErrorFieldTouched(errors, setTouched);

    // If form has errors
    const nbOfErrors = Object.keys(errors).length;

    if (nbOfErrors > 0) {
        const onClose = () => {
            componentRenderer.destroy('SaveErrorModal');
        };

        componentRenderer.render('SaveErrorModal', SaveErrorModal, {open: true, nbOfErrors, onClose});
        return false;
    }

    return true;
};

export const onServerError = (error, formikActions, notificationContext, t, defaultErrorMessage) => {
    // Set submitting false
    formikActions.setSubmitting(false);

    const graphQLErrors = error.graphQLErrors;
    if (graphQLErrors && graphQLErrors.length > 0) {
        for (const graphQLError of graphQLErrors) {
            if (graphQLError.message && graphQLError.message.startsWith('javax.jcr.ItemExistsException')) {
                // Custom handling for this error, system name is not valid

                notificationContext.notify(t('content-editor:label.contentEditor.error.changeSystemName'), ['closeButton']);
                formikActions.setFieldError('ce:systemName', 'alreadyExist');
                formikActions.setFieldTouched('ce:systemName', true, false);
                return;
            }

            if (graphQLError.message &&
                graphQLError.message.startsWith('org.jahia.services.content.PropertyConstraintViolationException') &&
                graphQLError.message.includes('Invalid link')) {
                // Custom handling for invalid link error

                const extractedErrorData = graphQLError.message.match(/^org.jahia.services.content.PropertyConstraintViolationException: (?<prop>(.*?)): Invalid link(?<link>(.*?))$/);
                if (extractedErrorData && extractedErrorData.groups && extractedErrorData.groups.prop && extractedErrorData.groups.link) {
                    const propNameIndex = extractedErrorData.groups.prop.lastIndexOf(' ');
                    const propName = extractedErrorData.groups.prop.substring(propNameIndex + 1);

                    notificationContext.notify(t('content-editor:label.contentEditor.error.invalidLinks'), ['closeButton']);
                    formikActions.setFieldError(propName, 'invalidLink_' + extractedErrorData.groups.link);
                    formikActions.setFieldTouched(propName, true, false);
                    return;
                }
            }
        }
    }

    // No error handling, print error in console and use default error message
    console.error(error);
    notificationContext.notify(t(defaultErrorMessage), ['closeButton']);
};
