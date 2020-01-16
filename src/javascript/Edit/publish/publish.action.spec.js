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

describe('publish action', () => {
    describe('onClick', () => {
        it('should call publishNode request', () => {
            const context = {
                publicationInfoContext: {
                    startPublicationInfoPolling: jest.fn()
                }
            };
            publishAction.onClick(context);

            expect(publishNode).toHaveBeenCalled();
            expect(context.publicationInfoContext.startPublicationInfoPolling).toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        let context;
        let props;

        beforeEach(() => {
            props = {
                formik: {
                    dirty: false
                },
                publicationInfoContext: {
                    publicationStatus: 'MODIFIED',
                    publicationInfoPolling: false,
                    startPublicationInfoPolling: jest.fn(),
                    stopPublicationInfoPolling: jest.fn()
                }
            };

            context = {
                mode: 'edit',
                nodeData: {
                    hasPublishPermission: true,
                    lockedAndCannotBeEdited: false
                }
            };
        });

        it('should disabled submit action when form is dirty', () => {
            props.formik.dirty = true;
            publishAction.init(context, props);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when publication info are not loaded', () => {
            props.publicationInfoContext.publicationStatus = undefined;
            publishAction.init(context, props);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when we are polling publication info', () => {
            props.publicationInfoContext.publicationInfoPolling = true;
            publishAction.init(context, props);
            expect(context.disabled).toBe(true);
        });

        it('should stop polling if we are polling and node is published', () => {
            props.publicationInfoContext.publicationStatus = 'PUBLISHED';
            props.publicationInfoContext.publicationInfoPolling = true;
            publishAction.init(context, props);
            expect(props.publicationInfoContext.stopPublicationInfoPolling).toHaveBeenCalled();
        });

        it('should not stop polling if we are polling and node is not published', () => {
            props.publicationInfoContext.publicationInfoPolling = true;
            publishAction.init(context, props);
            expect(props.publicationInfoContext.stopPublicationInfoPolling).not.toHaveBeenCalled();
        });

        it('should not disabled submit action when node is not already published', () => {
            props.publicationInfoContext.publicationStatus = 'NOT_PUBLISHED';
            publishAction.init(context, props);
            expect(context.disabled).toBe(false);
        });

        it('should disabled submit action when node is already published', () => {
            props.publicationInfoContext.publicationStatus = 'PUBLISHED';
            publishAction.init(context, props);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when node is UNPUBLISHABLE', () => {
            props.publicationInfoContext.publicationStatus = 'MANDATORY_LANGUAGE_UNPUBLISHABLE';
            publishAction.init(context, props);

            expect(context.disabled).toBe(true);
        });

        it('should display publish action when you have the proper permission and it\'s edit mode', () => {
            publishAction.init(context, props);
            expect(context.enabled).toBe(true);
        });

        it('should use label when polling is OFF', () => {
            publishAction.init(context, props);
            expect(context.buttonLabel).toBe('content-editor:label.contentEditor.edit.action.publish.name');
        });

        it('should use polling label when polling is ON', () => {
            props.publicationInfoContext.publicationInfoPolling = true;
            publishAction.init(context, props);
            expect(context.buttonLabel).toBe('content-editor:label.contentEditor.edit.action.publish.namePolling');
        });

        it('should undisplay publish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPublishPermission = false;
            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should undisplay publish action when mode is not edit', () => {
            context.mode = 'create';
            publishAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should disable publish action when node is locked', () => {
            context.nodeData.lockedAndCannotBeEdited = true;
            publishAction.init(context, props);

            expect(context.disabled).toBe(true);
        });
    });
});
