import {Constants} from '~/ContentEditor.constants';

export const onServerError = (error, formikActions, notificationContext, t, propFieldNameMapping, defaultErrorMessage) => {
    // Set submitting false
    formikActions.setSubmitting(false);

    let notificationErrorMessage = t(defaultErrorMessage);
    const graphQLErrors = error.graphQLErrors;
    if (graphQLErrors && graphQLErrors.length > 0) {
        for (const graphQLError of graphQLErrors) {
            if (graphQLError.message && graphQLError.message.startsWith('javax.jcr.ItemExistsException')) {
                // Custom handling for this error, system name is not valid

                notificationContext.notify(t('content-editor:label.contentEditor.error.changeSystemName'), ['closeButton']);
                notificationErrorMessage = null;
                formikActions.setFieldError(Constants.systemName.name, 'alreadyExist');
                formikActions.setFieldTouched(Constants.systemName.name, true, false);
            }

            if (graphQLError.errorType === 'GqlConstraintViolationException' &&
                graphQLError.extensions && graphQLError.extensions.constraintViolations &&
                graphQLError.extensions.constraintViolations.length > 0) {
                // Constraint violation errors

                for (const constraintViolation of graphQLError.extensions.constraintViolations) {
                    console.log('Constraint violation error: ', constraintViolation);
                    if (constraintViolation.propertyName) {
                        const fieldName = propFieldNameMapping[constraintViolation.propertyName];
                        if (fieldName) {
                            if (constraintViolation.constraintMessage.startsWith('Invalid link')) {
                                // Custom handling for invalid link error
                                formikActions.setFieldError(fieldName, 'invalidLink_' + constraintViolation.constraintMessage.substring('Invalid link'.length));
                            } else {
                                // Default constraint violation handling
                                formikActions.setFieldError(fieldName, 'constraintViolation_' + constraintViolation.constraintMessage);
                            }

                            formikActions.setFieldTouched(fieldName, true, false);
                            notificationErrorMessage = t('content-editor:label.contentEditor.error.constraintViolations');
                        }
                    }
                }
            }
        }
    }

    if (notificationErrorMessage) {
        notificationContext.notify(notificationErrorMessage, ['closeButton']);
    }
};
