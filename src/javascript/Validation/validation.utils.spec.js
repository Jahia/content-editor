import {validateForm, onServerError} from './validation.utils';

const t = val => val;

describe('validation utils', () => {
    describe('validateForm', () => {
        let formik;
        let renderComponent;
        let errors;
        beforeEach(() => {
            renderComponent = jest.fn();
            errors = {
                field1: 'required',
                field2: 'required'
            };
            formik = {
                validateForm: jest.fn(() => Promise.resolve(errors)),
                setTouched: jest.fn(() => Promise.resolve())
            };
        });

        it('should return true when there is no errors', async () => {
            errors = {};
            expect(await validateForm(formik, renderComponent)).toBe(true);
        });

        it('should return false when there is errors', async () => {
            expect(await validateForm(formik, renderComponent)).toBe(false);
        });

        it('should set fields in error to touched', async () => {
            await validateForm(formik, renderComponent);

            expect(formik.setTouched).toHaveBeenCalledWith({
                field1: true,
                field2: true
            });
        });

        it('should display a modal when field have erros', async () => {
            await validateForm(formik, renderComponent);
            expect(renderComponent).toHaveBeenCalled();
        });

        it('should not display a modal when field have no erros', async () => {
            errors = {};
            await validateForm(formik, renderComponent);
            expect(renderComponent).not.toHaveBeenCalled();
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

            expect(formikActions.setFieldTouched).toHaveBeenCalledWith('ce:systemName', true, false);
            expect(formikActions.setFieldError).toHaveBeenCalledWith('ce:systemName', 'alreadyExist');
            expect(formikActions.setSubmitting).toHaveBeenCalledWith(false);
        });

        it('should notify in case of server error', () => {
            const error = {
                graphQLErrors: [{
                    message: 'javax.jcr.JCRRepositoryException: Item not found'
                }]
            };

            onServerError(error, formikActions, notificationContext, t, 'default_message');

            expect(formikActions.setFieldTouched).not.toHaveBeenCalled();
            expect(formikActions.setFieldError).not.toHaveBeenCalled();
            expect(formikActions.setSubmitting).toHaveBeenCalledWith(false);
            expect(notificationContext.notify).toHaveBeenCalledWith('default_message', ['closeButton']);
            expect(console.error).toHaveBeenCalled();
        });
    });
});
