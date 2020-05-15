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
import {Constants} from '~/ContentEditor.constants';

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

        beforeEach(() => {
            context = {
                mode: 'edit',
                nodeData: {
                    hasPublishPermission: true,
                    lockedAndCannotBeEdited: false
                },
                formik: {
                    dirty: false,
                    values: {
                        'WIP::Info': {
                            status: 'DISABLED'
                        }
                    }
                },
                publicationInfoContext: {
                    publicationStatus: 'MODIFIED',
                    publicationInfoPolling: false,
                    startPublicationInfoPolling: jest.fn(),
                    stopPublicationInfoPolling: jest.fn()
                }
            };
        });

        it('should disabled submit action when form is dirty', () => {
            context.formik.dirty = true;
            publishAction.init(context);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when node is in WIP for all content', () => {
            context.formik.values[Constants.wip.fieldName].status = Constants.wip.status.ALL_CONTENT;
            publishAction.init(context);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when node is in WIP for current language', () => {
            context.formik.values[Constants.wip.fieldName].status = Constants.wip.status.LANGUAGES;
            context.formik.values[Constants.wip.fieldName].languages = ['en', 'fr'];
            context.language = 'en';
            publishAction.init(context);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when publication info are not loaded', () => {
            context.publicationInfoContext.publicationStatus = undefined;
            publishAction.init(context);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when we are polling publication info', () => {
            context.publicationInfoContext.publicationInfoPolling = true;
            publishAction.init(context);
            expect(context.disabled).toBe(true);
        });

        it('should stop polling if we are polling and node is published', () => {
            context.publicationInfoContext.publicationStatus = 'PUBLISHED';
            context.publicationInfoContext.publicationInfoPolling = true;
            publishAction.init(context);
            expect(context.publicationInfoContext.stopPublicationInfoPolling).toHaveBeenCalled();
        });

        it('should not stop polling if we are polling and node is not published', () => {
            context.publicationInfoContext.publicationInfoPolling = true;
            publishAction.init(context);
            expect(context.publicationInfoContext.stopPublicationInfoPolling).not.toHaveBeenCalled();
        });

        it('should not disabled submit action when node is not already published', () => {
            context.publicationInfoContext.publicationStatus = 'NOT_PUBLISHED';
            publishAction.init(context);
            expect(context.disabled).toBe(false);
        });

        it('should disabled submit action when node is already published', () => {
            context.publicationInfoContext.publicationStatus = 'PUBLISHED';
            publishAction.init(context);
            expect(context.disabled).toBe(true);
        });

        it('should disabled submit action when node is UNPUBLISHABLE', () => {
            context.publicationInfoContext.publicationStatus = 'MANDATORY_LANGUAGE_UNPUBLISHABLE';
            publishAction.init(context);

            expect(context.disabled).toBe(true);
        });

        it('should display publish action when you have the proper permission and it\'s edit mode', () => {
            publishAction.init(context);
            expect(context.enabled).toBe(true);
        });

        it('should use label when polling is OFF', () => {
            publishAction.init(context);
            expect(context.buttonLabel).toBe('content-editor:label.contentEditor.edit.action.publish.name');
        });

        it('should use polling label when polling is ON', () => {
            context.publicationInfoContext.publicationInfoPolling = true;
            publishAction.init(context);
            expect(context.buttonLabel).toBe('content-editor:label.contentEditor.edit.action.publish.namePolling');
        });

        it('should undisplay publish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPublishPermission = false;
            publishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should undisplay publish action when mode is not edit', () => {
            context.mode = 'create';
            publishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should disable publish action when node is locked', () => {
            context.nodeData.lockedAndCannotBeEdited = true;
            publishAction.init(context);

            expect(context.disabled).toBe(true);
        });
    });
});
