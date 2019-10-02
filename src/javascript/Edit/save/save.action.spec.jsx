import saveAction from './save.action';

jest.mock('~/actions/redux.action', () => {
    let statemock;
    return {
        reduxAction: mapStateToContext => {
            return {
                init: context => {
                    const contextToAdd = mapStateToContext(statemock);
                    Object.keys(contextToAdd).forEach(key => {
                        context[key] = contextToAdd[key];
                    });
                }
            };
        },
        setReduxState: s => {
            statemock = s;
        }
    };
});

import {setReduxState} from '~/actions/redux.action';

describe('save action', () => {
    describe('init', () => {
        beforeEach(() => {
            setReduxState({
                mode: 'edit'
            });
        });

        it('should disabled button when form is at his initialValues and all required fields were filled', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: false,
                    errors: {}
                }
            };
            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.disabled).toBe(true);
        });

        it('should enable button when form is not at his initialValues and all required fields were filled', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: true,
                    errors: {}
                }
            };
            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.disabled).toBe(false);
        });

        it('should disable save button when required fields were not filled and form is dirty', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: true,
                    errors: {
                        myFiled1: 'required',
                        myFiled2: 'required'
                    }
                }
            };

            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.disabled).toBe(true);
        });

        it('should disable save button when required fields were not filled and form is pristine', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: false,
                    errors: {
                        myFiled1: 'required',
                        myFiled2: 'required'
                    }
                }
            };

            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.disabled).toBe(true);
        });

        it('should not display save action when it isn\'t the edit mode', () => {
            const context = {};
            setReduxState({
                mode: 'create'
            });
            const props = {
                formik: {
                    dirty: true,
                    errors: {}
                }
            };

            saveAction.init(context, props);
            expect(context.enabled).toBe(false);
        });

        it('should disable save action when it is the edit mode', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: true,
                    errors: {}
                }
            };
            saveAction.init(context, props);
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
