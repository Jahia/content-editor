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

import saveAction from './save.action';

describe('save action', () => {
    describe('init', () => {
        let context;
        beforeEach(() => {
            context = {
                mode: 'edit'
            };
        });

        it('should add warn chip on button when all required fields were filled', () => {
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
            context.mode = 'create';

            const props = {
                formik: {
                    dirty: true,
                    errors: {}
                }
            };

            saveAction.init(context, props);
            expect(context.enabled).toBe(false);
        });

        it('should enable save action when it is the edit mode', () => {
            const props = {
                formik: {
                    dirty: true,
                    errors: {}
                },
                publicationInfoContext: {
                    publicationInfoPolling: false
                }
            };
            saveAction.init(context, props);
            expect(context.enabled).toBe(true);
            expect(context.disabled).toBe(false);
        });

        it('should disable save action when publication info is polling', () => {
            const props = {
                formik: {
                    dirty: true,
                    errors: {}
                },
                publicationInfoContext: {
                    publicationInfoPolling: true
                }
            };
            saveAction.init(context, props);
            expect(context.enabled).toBe(true);
            expect(context.disabled).toBe(true);
        });

        it('should disable save action when form is dirty', () => {
            const props = {
                formik: {
                    dirty: false,
                    errors: {}
                },
                publicationInfoContext: {
                    publicationInfoPolling: false
                }
            };
            saveAction.init(context, props);
            expect(context.enabled).toBe(true);
            expect(context.disabled).toBe(true);
        });
    });

    describe('onClick', () => {
        let context;
        beforeEach(() => {
            context = {
                formik: {
                    submitForm: jest.fn(() => Promise.resolve()),
                    resetForm: jest.fn(() => Promise.resolve()),
                    setFieldValue: jest.fn(),
                    setTouched: jest.fn(() => Promise.resolve()),
                    validateForm: jest.fn(() => Promise.resolve(context.formik.errors)),
                    dirty: true,
                    errors: {}
                },
                renderComponent: jest.fn()
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

            expect(context.renderComponent).toHaveBeenCalled();
        });
    });
});
