import createAction from './create.action';

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

describe('create action', () => {
    describe('onClick', () => {
        let context;
        beforeEach(() => {
            context = {
                formik: {
                    submitForm: jest.fn(() => Promise.resolve()),
                    resetForm: jest.fn(),
                    setFieldValue: jest.fn(),
                    setTouched: jest.fn(),
                    errors: {}
                },
                renderComponent: jest.fn()
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

        it('should not submit form when form is invalid', () => {
            context.formik = {
                ...context.formik,
                errors: {
                    myFiled1: 'required',
                    myFiled2: 'required'
                }
            };

            createAction.onClick(context);

            expect(context.formik.submitForm).not.toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        let context;
        let props;
        beforeEach(() => {
            context = {};
            props = {
                formik: {
                    errors: {}
                }
            };
        });

        it('should enable create action when mode is create', () => {
            setReduxState({
                mode: 'create'
            });

            createAction.init(context, props);
            expect(context.enabled).toBe(true);
        });

        it('should disable create action when mode is edit', () => {
            setReduxState({
                mode: 'edit'
            });

            createAction.init(context, props);
            expect(context.enabled).toBe(false);
        });

        it('should not add warn chip on button when all required fields were filled', () => {
            createAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.addWarningBadge).toBe(false);
        });

        it('should add warning badge on create button when required fields were not filled', () => {
            props.formik = {
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
