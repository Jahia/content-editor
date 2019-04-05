import publishAction from './publishAction';

describe('publish action', () => {
    describe('onClik', () => {
        it('should do nothing when formik is not available', () => {
            const context = {};

            publishAction.onClick(context);

            expect(Object.keys(context).length).toBe(0);
        });

        it('should submit form when formik is available', () => {
            const context = {
                formik: {
                    submitForm: jest.fn(),
                    setFieldValue: jest.fn()
                }
            };

            publishAction.onClick(context);

            expect(context.formik.submitForm).toHaveBeenCalled();
        });

        it('should set context submitOperation to appriopriate publish value', () => {
            const context = {
                formik: {
                    submitForm: jest.fn(),
                    setFieldValue: jest.fn()
                }
            };

            publishAction.onClick(context);

            expect(context.submitOperation).toBe('PUBLISH');
        });
    });

    describe('onInit', () => {
        it('should not enable submit action when form is not saved', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: true
                }
            };

            publishAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(false);
        });

        it('should enable submit action when form is saved', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: false
                }
            };

            publishAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(true);
        });
    });
});
