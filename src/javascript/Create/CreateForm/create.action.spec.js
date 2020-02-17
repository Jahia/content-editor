import createAction from './create.action';

describe('create action', () => {
    describe('onClick', () => {
        let context;
        beforeEach(() => {
            context = {
                formik: {
                    submitForm: jest.fn(() => Promise.resolve()),
                    validateForm: jest.fn(() => Promise.resolve(context.formik.errors)),
                    resetForm: jest.fn(),
                    setFieldValue: jest.fn(),
                    setTouched: jest.fn(() => Promise.resolve()),
                    errors: {}
                },
                renderComponent: jest.fn()
            };
        });

        it('should do nothing when formik is not available', async () => {
            const context = {};

            await createAction.onClick(context);

            expect(Object.keys(context).length).toBe(0);
        });

        it('should submit form when formik is available', async () => {
            await createAction.onClick(context);

            expect(context.formik.submitForm).toHaveBeenCalled();
        });

        it('should not submit form when form is invalid', async () => {
            context.formik = {
                ...context.formik,
                errors: {
                    myFiled1: 'required',
                    myFiled2: 'required'
                }
            };

            await createAction.onClick(context);

            expect(context.formik.submitForm).not.toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        let context;
        const props = {};
        beforeEach(() => {
            context = {
                formik: {
                    errors: {}
                }
            };
        });

        it('should enable create action when mode is create', () => {
            context.mode = 'create';

            createAction.init(context, props);
            expect(context.enabled).toBe(true);
        });

        it('should disable create action when mode is edit', () => {
            context.mode = 'edit';

            createAction.init(context, props);
            expect(context.enabled).toBe(false);
        });

        it('should not add warn chip on button when all required fields were filled', () => {
            createAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.addWarningBadge).toBe(false);
        });

        it('should add warning badge on create button when required fields were not filled', () => {
            context.formik = {
                errors: {
                    myFiled1: 'required',
                    myFiled2: 'required'
                }
            };

            createAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.addWarningBadge).toBe(true);
        });
    });
});
