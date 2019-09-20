import unpublishAction from './unpublish.action';

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

describe('unpublish action', () => {
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

            unpublishAction.onClick(context);

            expect(Object.keys(context).length).toBe(0);
        });

        it('should submit form when formik is available', () => {
            unpublishAction.onClick(context);

            expect(context.formik.submitForm).toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        let context;
        beforeEach(() => {
            context = {
                nodeData: {
                    aggregatedPublicationInfo: {
                        publicationStatus: 'PUBLISHED'
                    },
                    hasPermission: true
                },
                formik: {
                    dirty: true
                }
            };

            setReduxState({
                mode: 'edit'
            });
        });

        it('should not enable unpublish action when form is not saved', () => {
            unpublishAction.init(context);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(false);
        });

        it('should enable unpublish action when form is saved and published', () => {
            context.formik.dirty = false;

            unpublishAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not enable unpublish action when node is not published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'MODIFIED';
            context.formik.dirty = false;

            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should disable unpublish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPermission = false;
            context.formik.dirty = false;
            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should disable unpublish action when it isn\'t the edit mode', () => {
            setReduxState({
                mode: 'create'
            });
            context.formik.dirty = false;

            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should disable unpublish action when it is submmitting form', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'MODIFIED';
            context.formik.dirty = false;
            context.formik.isSubmitting = true;

            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });
    });
});
