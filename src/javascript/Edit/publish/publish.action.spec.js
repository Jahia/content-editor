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

            setReduxState({
                mode: 'edit'
            });
        });

        it('should not disabled submit action when node is not already published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'NOT_PUBLISHED';
            publishAction.init(context, {});
            expect(context.disabled).toBe(false);
        });

        it('should disabled submit action when node is already published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'PUBLISHED';
            publishAction.init(context, {});
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when node is UNPUBLISHABLE', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'MANDATORY_LANGUAGE_UNPUBLISHABLE';
            publishAction.init(context, {});

            expect(context.disabled).toBe(true);
        });

        it('should display publish action when you have the proper permission and it\'s edit mode', () => {
            publishAction.init(context, {});
            expect(context.enabled).toBe(true);
        });

        it('should undisplay publish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPermission = false;
            publishAction.init(context, {});

            expect(context.enabled).toBe(false);
        });

        it('should disable publish action when mode is not edit', () => {
            setReduxState({
                mode: 'create'
            });
            publishAction.init(context, {});

            expect(context.enabled).toBe(false);
        });
    });
});
