import saveAction from './saveAction';

describe('save action', () => {
    describe('init', () => {
        it('should not display anything when form is at his initialValues', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: false
                }
            };

            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(false);
        });

        it('should display save button when form is not at his initialValues', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: true
                }
            };

            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(true);
        });
    });

    describe('onClick', () => {
        let context;
        beforeEach(() => {
            context = {
                formik: {
                    submitForm: jest.fn(() => Promise.resolve()),
                    resetForm: jest.fn(),
                    setFieldValue: jest.fn()
                }
            };
        });

        it('should submitForm', async () => {
            await saveAction.onClick(context);

            expect(context.formik.submitForm).toHaveBeenCalled();
        });

        it('should set context submitOperation to appriopriate publish value', async () => {
            await saveAction.onClick(context);

            expect(context.submitOperation).toBe('SAVE');
        });

        it('should resetForm when submitting', async () => {
            await saveAction.onClick(context);

            expect(context.formik.resetForm).toHaveBeenCalled();
        });

        it('shouldn\'t call resetForm when submitForm ', async () => {
            context.formik.submitForm = jest.fn(() => Promise.reject());
            try {
                await saveAction.onClick(context);
            } catch (e) {}

            expect(context.formik.resetForm).not.toHaveBeenCalled();
        });
    });
});
