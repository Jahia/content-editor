import {Constants} from '~/ContentEditor.constants';
import {onServerError} from './onServerError';

const t = val => val;

describe('validation utils', () => {
    describe('validate on server error', () => {
        const consoleErrorOriginal = console.error;

        let formikActions;
        let notificationContext;
        beforeEach(() => {
            formikActions = {
                setSubmitting: jest.fn(),
                setFieldError: jest.fn(),
                setFieldTouched: jest.fn()
            };
            notificationContext = {
                notify: jest.fn()
            };
            console.error = jest.fn();
        });

        afterEach(() => {
            console.error = consoleErrorOriginal;
        });

        it('should return system name validation error for ItemAlreadyExist server error', () => {
            const error = {
                graphQLErrors: [{
                    message: 'javax.jcr.ItemExistsException: This node already exists: /sites/digitall/contents/test'
                }]
            };

            onServerError(error, formikActions, {}, 'en', notificationContext, t, 'default_message');

            expect(formikActions.setFieldTouched).toHaveBeenCalledWith(Constants.systemName.name, true, false);
            expect(formikActions.setFieldError).toHaveBeenCalledWith(Constants.systemName.name, 'alreadyExist');
            expect(formikActions.setSubmitting).toHaveBeenCalledWith(false);
        });

        it('should return invalid link validation error', () => {
            const error = {
                graphQLErrors: [{
                    errorType: 'GqlConstraintViolationException',
                    extensions: {
                        constraintViolations: [{
                            constraintMessage: 'Invalid link/sites/tutorials/files/Images/personalization/any content.PNG',
                            propertyName: 'text',
                            locale: 'en'
                        }]
                    }
                }]
            };

            onServerError(error, formikActions, {}, 'en', notificationContext, t, {text: 'fuu_text'}, 'default_message');

            expect(formikActions.setFieldTouched).toHaveBeenCalledWith('fuu_text', true, false);
            expect(formikActions.setFieldError).toHaveBeenCalledWith('fuu_text', 'invalidLink_/sites/tutorials/files/Images/personalization/any content.PNG');
            expect(formikActions.setSubmitting).toHaveBeenCalledWith(false);
        });

        it('should return validation error in case of constraint violation error', () => {
            const error = {
                graphQLErrors: [{
                    errorType: 'GqlConstraintViolationException',
                    extensions: {
                        constraintViolations: [{
                            constraintMessage: 'Error message from backend',
                            propertyName: 'text',
                            locale: 'en'
                        }]
                    }
                }]
            };

            onServerError(error, formikActions, {}, 'en', notificationContext, t, {text: 'fuu_text'}, 'default_message');

            expect(formikActions.setFieldTouched).toHaveBeenCalledWith('fuu_text', true, false);
            expect(formikActions.setFieldError).toHaveBeenCalledWith('fuu_text', 'constraintViolation_Error message from backend');
            expect(formikActions.setSubmitting).toHaveBeenCalledWith(false);
        });

        it('should notify in case of server error', () => {
            const error = {
                graphQLErrors: [{
                    message: 'javax.jcr.JCRRepositoryException: Item not found'
                }]
            };

            onServerError(error, formikActions, {}, 'en', notificationContext, t, {}, 'default_message');

            expect(formikActions.setFieldTouched).not.toHaveBeenCalled();
            expect(formikActions.setFieldError).not.toHaveBeenCalled();
            expect(formikActions.setSubmitting).toHaveBeenCalledWith(false);
            expect(notificationContext.notify).toHaveBeenCalledWith('default_message', ['closeButton']);
        });
    });
});
