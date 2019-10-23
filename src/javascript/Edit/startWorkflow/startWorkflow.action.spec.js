import startWorkflowAction from './startWorkflow.action';

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

describe('startWorkflow action', () => {
    describe('onInit - 3 dots', () => {
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
                    hasPublishPermission: true,
                    lockInfo: {
                        isLocked: false
                    }
                }
            };

            setReduxState({
                mode: 'edit'
            });
        });

        it('should display startWorkflowAction when user have start workflow rights', () => {
            startWorkflowAction.init(context, props);

            expect(context.enabled).toBe(true);
        });

        it('should not display startWorkflowAction when it\'s not edit mode', () => {
            setReduxState({
                mode: 'create'
            });
            startWorkflowAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should not display startWorkflowAction when user haven\'t publication rights', () => {
            context.nodeData.hasPublishPermission = false;
            startWorkflowAction.init(context, props);

            expect(context.enabled).toBe(false);
        });
    });

    describe('onInit - main button', () => {
        let context;
        let props;

        beforeEach(() => {
            props = {
                formik: {
                    dirty: false
                }
            };

            context = {
                isMainButton: true,
                nodeData: {
                    hasStartPublicationWorkflowPermission: true,
                    lockInfo: {
                        isLocked: false
                    }
                }
            };

            setReduxState({
                mode: 'edit'
            });
        });

        it('should display startWorkflowAction when user have start workflow rights', () => {
            startWorkflowAction.init(context, props);

            expect(context.enabled).toBe(true);
        });

        it('should not display startWorkflowAction when it\'s not edit mode', () => {
            setReduxState({
                mode: 'create'
            });
            startWorkflowAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should not display startWorkflowAction when user doesn\'t have start workflow right', () => {
            context.nodeData.hasStartPublicationWorkflowPermission = false;
            startWorkflowAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should not display startWorkflowAction when user have publication rights', () => {
            context.nodeData.hasPublishPermission = true;
            startWorkflowAction.init(context, props);

            expect(context.enabled).toBe(false);
        });

        it('should not disable request publication action when node is not locked', () => {
            startWorkflowAction.init(context, props);

            expect(context.disabled).toBe(false);
        });

        it('should disable request publication action when node is locked', () => {
            context.nodeData.lockInfo.isLocked = true;
            startWorkflowAction.init(context, props);

            expect(context.disabled).toBe(true);
        });

        it('should disable request publication action form is dirty', () => {
            props.formik.dirty = true;
            startWorkflowAction.init(context, props);

            expect(context.disabled).toBe(true);
        });
    });

    describe('onClick', () => {
        beforeEach(() => {
            window.parent.authoringApi = {
                openPublicationWorkflow: jest.fn()
            };
        });

        it('should call GWT command', () => {
            startWorkflowAction.onClick({nodeData: {uuid: 'hello'}});

            expect(window.parent.authoringApi.openPublicationWorkflow).toHaveBeenCalled();
        });
    });
});
