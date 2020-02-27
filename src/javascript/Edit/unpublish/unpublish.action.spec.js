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
jest.mock('./unpublish.request', () => {
    return {
        unpublishNode: jest.fn()
    };
});

import {unpublishNode} from './unpublish.request';

describe('unpublish action', () => {
    describe('onClick', () => {
        it('should call unpublishNode', () => {
            unpublishAction.onClick({
                enabled: true
            });

            expect(unpublishNode).toHaveBeenCalled();
        });
    });

    describe('onInit', () => {
        let context;
        beforeEach(() => {
            context = {
                mode: 'edit',
                publicationInfoContext: {
                    publicationStatus: 'PUBLISHED'
                },
                nodeData: {
                    hasPublishPermission: true
                }
            };
        });

        it('should display unpublish action when form is saved and published', () => {
            unpublishAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not display unpublish action when publication are not loaded', () => {
            context.publicationInfoContext.publicationStatus = undefined;
            unpublishAction.init(context);
            expect(context.enabled).toBe(false);
        });

        it('should not display unpublish action when node is not published', () => {
            context.publicationInfoContext.publicationStatus = 'MODIFIED';

            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should not display unpublish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPublishPermission = false;
            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should not display unpublish action when it isn\'t the edit mode', () => {
            context.mode = 'create';

            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });
    });
});
