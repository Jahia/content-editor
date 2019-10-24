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

jest.mock('@jahia/react-material', () => {
    let renderComponentmock = jest.fn();
    return {
        componentRendererAction: {
            onClick: context => {
                context.renderComponent = renderComponentmock;
            }
        },
        renderComponentmock,
        composeActions: (...actions) => {
            return actions.reduce((finalAction, action) => {
                return {
                    init: (...args) => {
                        if (finalAction.init) {
                            finalAction.init(...args);
                        }

                        if (action.init) {
                            action.init(...args);
                        }
                    },
                    onClick: (...args) => {
                        if (finalAction.onClick) {
                            finalAction.onClick(...args);
                        }

                        if (action.onClick) {
                            action.onClick(...args);
                        }
                    }
                };
            }, {});
        }
    };
});

import {renderComponentmock} from '@jahia/react-material';
import {setReduxState} from '~/actions/redux.action';
import saveAction from './save.action';

describe('save action', () => {
    describe('init', () => {
        beforeEach(() => {
            setReduxState({
                mode: 'edit'
            });
        });

        it('should add warn chip on button when all required fields were filled', () => {
            const context = {};
            const props = {
                formik: {
                    errors: {}
                }
            };
            saveAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.addWarningBadge).toBe(false);
        });

        it('should add warning badge on save button when required fields were not filled', () => {
            const context = {};
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
            expect(context.addWarningBadge).toBe(true);
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
                    setFieldValue: jest.fn(),
                    setTouched: jest.fn(),
                    dirty: true,
                    errors: {}
                }
            };
        });

        it('shouldn\'t do anything when form is not dirty', async () => {
            context.formik.dirty = false;
            await saveAction.onClick(context);
            expect(context.formik.submitForm).not.toHaveBeenCalled();
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

        it('should show a modal when form have errors', async () => {
            context.formik.errors = {
                field1: 'required'
            };

            await saveAction.onClick(context);

            expect(renderComponentmock).toHaveBeenCalled();
        });
    });
});
