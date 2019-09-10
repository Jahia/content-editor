import createAction from './create.action';

describe('create action', () => {
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

        it('should do nothing when formik is not available', () => {
            const context = {};

            createAction.onClick(context);

            expect(Object.keys(context).length).toBe(0);
        });

        it('should submit form when formik is available', () => {
            createAction.onClick(context);

            expect(context.formik.submitForm).toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        // TODO BACKLOG-11052
    });
});
