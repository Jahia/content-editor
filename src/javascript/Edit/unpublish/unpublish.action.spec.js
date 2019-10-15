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

import {setReduxState} from '~/actions/redux.action';
import {unpublishNode} from './unpublish.request';

describe('unpublish action', () => {
    describe('onClick', () => {
        it('should call unpublishNode', () => {
            unpublishAction.onClick({});

            expect(unpublishNode).toHaveBeenCalled();
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
                    hasPublishPermission: true
                }
            };

            setReduxState({
                mode: 'edit'
            });
        });

        it('should display unpublish action when form is saved and published', () => {
            unpublishAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not display unpublish action when node is not published', () => {
            context.nodeData.aggregatedPublicationInfo.publicationStatus = 'MODIFIED';

            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should not display unpublish action when you haven\'t the proper permission', () => {
            context.nodeData.hasPublishPermission = false;
            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should not display unpublish action when it isn\'t the edit mode', () => {
            setReduxState({
                mode: 'create'
            });

            unpublishAction.init(context);

            expect(context.enabled).toBe(false);
        });
    });
});
