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

    let notificationErrorMessage = t(defaultErrorMessage);
    const graphQLErrors = error.graphQLErrors;
    if (graphQLErrors && graphQLErrors.length > 0) {
        let notify = false;
        for (const graphQLError of graphQLErrors) {
            if (graphQLError.message && graphQLError.message.startsWith('javax.jcr.ItemExistsException')) {
                // Custom handling for this error, system name is not valid

                notificationContext.notify(t('content-editor:label.contentEditor.error.changeSystemName'), ['closeButton']);
                notificationErrorMessage = null;
                formikActions.setFieldError('ce:systemName', 'alreadyExist');
                formikActions.setFieldTouched('ce:systemName', true, false);
            }

            if (graphQLError.errorType === 'GqlConstraintViolationException' &&
                graphQLError.extensions && graphQLError.extensions.constraintViolations &&
                graphQLError.extensions.constraintViolations.length > 0) {
                // Constraint violation errors

                notify = true;
                for (const constraintViolation of graphQLError.extensions.constraintViolations) {
                    console.log('Constraint violation error: ', constraintViolation)
                    if (constraintViolation.propertyName) {
                        if (constraintViolation.constraintMessage.startsWith('Invalid link')) {
                            // Custom handling for invalid link error
                            formikActions.setFieldError(constraintViolation.propertyName, 'invalidLink_' + constraintViolation.constraintMessage.substring("Invalid link".length));
                        } else {
                            // Default constraint violation handling
                            formikActions.setFieldError(constraintViolation.propertyName, 'constraintViolation_' + constraintViolation.constraintMessage);
                        }
                        formikActions.setFieldTouched(constraintViolation.propertyName, true, false);
                        notificationErrorMessage = t('content-editor:label.contentEditor.error.constraintViolations');
                    }
                }
            }
        }
    }

    if (notificationErrorMessage) {
        notificationContext.notify(notificationErrorMessage, ['closeButton']);
    }
};
