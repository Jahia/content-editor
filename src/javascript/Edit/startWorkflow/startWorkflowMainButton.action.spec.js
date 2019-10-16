import startWorkflowAction from './startWorkflowMainButton.action';

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

describe('startWorkflow main button action', () => {
    describe('onInit', () => {
        let context;

        beforeEach(() => {
            context = {
                mode: 'edit',
                nodeData: {
                    hasStartPublicationWorkflowPermission: true
                }
            };

            setReduxState({
                mode: 'edit'
            });
        });

        it('should display startWorkflowAction when user have start workflow rights', () => {
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not display startWorkflowAction when it\'s not edit mode', () => {
            setReduxState({
                mode: 'create'
            });
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should not display startWorkflowAction when user doesn\'t have start workflow right', () => {
            context.nodeData.hasStartPublicationWorkflowPermission = false;
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(false);
        });

        it('should not display startWorkflowAction when user have publication rights', () => {
            context.nodeData.hasPublishPermission = true;
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(false);
        });
    });
});
