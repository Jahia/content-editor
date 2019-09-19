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
        it('should not display anything when form is at his initialValues', () => {
            const context = {};
            const props = {
                formik: {
                    dirty: false
                }
            };

            setReduxState({
                mode: 'edit'
            });

            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(false);
        });

        it('should display save button when form is not at his initialValues', () => {
            const context = {};
            setReduxState({
                mode: 'edit'
            });
            const props = {
                formik: {
                    dirty: true
                }
            };

            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(true);
        });

        it('should display save button when all required fields were filled', () => {
            const context = {};
            setReduxState({
                mode: 'edit'
            });
            const props = {
                formik: {
                    errors: {}
                }
            };

            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.disabled).toBe(false);
        });

        it('should display save button but disabled when required fields were not filled', () => {
            const context = {};
            setReduxState({
                mode: 'edit'
            });
            const props = {
                formik: {
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

        it('should disable save action when it isn\'t the edit mode', () => {
            const context = {};
            setReduxState({
                mode: 'create'
            });

            const props = {
                formik: {
                    dirty: true
                }
            };

            saveAction.init(context, props);
            expect(context.enabled).toBe(false);
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
