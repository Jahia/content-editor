import {onServerError, validateForm} from './validation.utils';
import {Constants} from '~/ContentEditor.constants';

const t = val => val;

describe('validation utils', () => {
    describe('validateForm', () => {
        let sections = [{
            fieldSets:[{
                fields: [
                    {name: 'field1'},
                    {name: 'field2'},
                ]
            }]
        }];
        let formik;
        let renderComponent;
        let render;
        let errors;
        beforeEach(() => {
            render = jest.fn();
            renderComponent = {render};
            errors = {
                field1: 'required',
                field2: 'required'
            };
            formik = {
                validateForm: jest.fn(() => Promise.resolve(errors)),
                setTouched: jest.fn(() => Promise.resolve())
            };
        });

        it('should return null when there is no errors', async () => {
            errors = {};
            expect((await validateForm(formik, {}, sections, "en", {}, renderComponent)).errors).toBeUndefined();
        });

        it('should return object with errors', async () => {
            expect((await validateForm(formik, {}, sections, "en", {}, renderComponent)).errors).toBeDefined();
        });

        it('should set fields in error to touched', async () => {
            await validateForm(formik, {}, sections, "en", {}, renderComponent);

            expect(formik.setTouched).toHaveBeenCalledWith({
                field1: true,
                field2: true
            });
        });

        it('should display a modal when field have errors', async () => {
            await validateForm(formik, {}, sections, "en", {}, renderComponent);
            expect(render).toHaveBeenCalled();
        });

        it('should not display a modal when field have no errors', async () => {
            errors = {};
            render = jest.fn();
            await validateForm(formik, {}, sections, "en", {}, renderComponent);
            expect(render).not.toHaveBeenCalled();
        });
    });

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

            onServerError(error, formikActions, notificationContext, t, 'default_message');

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
                            propertyName: 'text'
                        }]
                    }
                }]
            };

            onServerError(error, formikActions, notificationContext, t, {text: 'fuu_text'}, 'default_message');

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
                            propertyName: 'text'
                        }]
                    }
                }]
            };

            onServerError(error, formikActions, notificationContext, t, {text: 'fuu_text'}, 'default_message');

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

            onServerError(error, formikActions, notificationContext, t, {}, 'default_message');

            expect(formikActions.setFieldTouched).not.toHaveBeenCalled();
            expect(formikActions.setFieldError).not.toHaveBeenCalled();
            expect(formikActions.setSubmitting).toHaveBeenCalledWith(false);
            expect(notificationContext.notify).toHaveBeenCalledWith('default_message', ['closeButton']);
        });
    });
});
