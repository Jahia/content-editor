import publishAction from './publish.action';

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

describe('publish action', () => {
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
            setReduxState({
                mode: 'edit'
            });
        });

        it('should do nothing when formik is not available', () => {
            const context = {};

            publishAction.onClick(context);

            expect(Object.keys(context).length).toBe(0);
        });

        it('should submit form when formik is available', () => {
            publishAction.onClick(context);

            expect(context.formik.submitForm).toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        let context;
        beforeEach(() => {
            context = {
                nodeData: {
                    aggregatedPublicationInfo: {
                        publicationStatus: 'MODIFIED'
                    },
                    hasPermission: true
                }
            };
        });

        it('should not enable submit action when form is not saved', () => {
            const props = {
                formik: {
                    dirty: true
                }
            };

            publishAction.init(context, props);

            // As action expect impure function, testing params
            expect(context.enabled).toBe(false);
        });

        it('should enable submit action when form is saved', () => {
            const props = {
                formik: {
                    dirty: false
                }
            };

            publishAction.init(context, props);

            expect(context.enabled).toBe(true);
        });

        it('should enable submit action when node is already published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'PUBLISHED';
            const props = {
                formik: {
                    dirty: false
                }
            };

            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should enable submit action when node is UNPUBLISHABLE', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'MANDATORY_LANGUAGE_UNPUBLISHABLE';
            const props = {
                formik: {
                    dirty: false
                }
            };

            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should disable publish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPermission = false;
            const props = {
                formik: {
                    dirty: false
                }
            };
            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should disable publish action when mode is not edit', () => {
            setReduxState({
                mode: 'create'
            });

            const props = {
                formik: {
                    dirty: false
                }
            };
            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });
    });
});
