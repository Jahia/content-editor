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
});
