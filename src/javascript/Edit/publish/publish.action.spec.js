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

jest.mock('./publish.request', () => {
    return {
        publishNode: jest.fn()
    };
});

import {publishNode} from './publish.request';
import {setReduxState} from '~/actions/redux.action';

describe('publish action', () => {
    describe('onClick', () => {
        it('should call publishNode request', () => {
            publishAction.onClick({});

            expect(publishNode).toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        let context;
        let props;

        beforeEach(() => {
            props = {
                formik: {
                    dirty: false
                }
            };

            context = {
                nodeData: {
                    aggregatedPublicationInfo: {
                        publicationStatus: 'MODIFIED'
                    },
                    hasPublishPermission: true
                }
            };

            setReduxState({
                mode: 'edit'
            });
        });

        it('should disabled submit action when form is dirty', () => {
            props.formik.dirty = true;
            publishAction.init(context, props);
            expect(context.disabled).toBe(true);
        });

        it('should not disabled submit action when node is not already published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'NOT_PUBLISHED';
            publishAction.init(context, props);
            expect(context.disabled).toBe(false);
        });

        it('should disabled submit action when node is already published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'PUBLISHED';
            publishAction.init(context, props);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when node is UNPUBLISHABLE', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'MANDATORY_LANGUAGE_UNPUBLISHABLE';
            publishAction.init(context, props);

            expect(context.disabled).toBe(true);
        });

        it('should display publish action when you have the proper permission and it\'s edit mode', () => {
            publishAction.init(context, props);
            expect(context.enabled).toBe(true);
        });

        it('should undisplay publish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPublishPermission = false;
            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should disable publish action when mode is not edit', () => {
            setReduxState({
                mode: 'create'
            });
            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });
    });
});
