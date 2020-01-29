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

describe('startWorkflow action', () => {
    describe('onInit - 3 dots', () => {
        let context;

        beforeEach(() => {
            context = {
                mode: 'edit',
                parent: {
                    formik: {
                        dirty: false
                    }
                },
                nodeData: {
                    hasPublishPermission: true,
                    lockedAndCannotBeEdited: false
                },
                formik: {}
            };
        });

        it('should display startWorkflowAction when user have start workflow rights', () => {
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not display startWorkflowAction when it\'s not edit mode', () => {
            context.mode = 'create';
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(false);
            expect(context.displayDisabled).toBe(undefined);
        });

        it('should not display startWorkflowAction when user haven\'t publication rights', () => {
            context.nodeData.hasPublishPermission = false;
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(false);
            expect(context.displayDisabled).toBe(undefined);
        });

        it('should disable startWorkflowAction when form dirty', () => {
            context.formik.dirty = true;
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(false);
            expect(context.displayDisabled).toBe(true);
        });

        it('should disable startWorkflowAction when node locked', () => {
            context.nodeData.lockedAndCannotBeEdited = true;
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(false);
            expect(context.displayDisabled).toBe(true);
        });
    });

    describe('onInit - main button', () => {
        let context;

        beforeEach(() => {
            context = {
                mode: 'edit',
                isMainButton: true,
                nodeData: {
                    hasStartPublicationWorkflowPermission: true,
                    lockedAndCannotBeEdited: false
                },
                formik: {
                    dirty: false
                },
                disabled: false
            };
        });

        it('should display startWorkflowAction when user have start workflow rights', () => {
            startWorkflowAction.init(context);

            expect(context.enabled).toBe(true);
        });

        it('should not display startWorkflowAction when it\'s not edit mode', () => {
            context.mode = 'create';
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

        it('should not disable request publication action when node is not locked', () => {
            startWorkflowAction.init(context);

            expect(context.disabled).toBe(false);
        });

        it('should disable request publication action when node is locked', () => {
            context.nodeData.lockedAndCannotBeEdited = true;
            startWorkflowAction.init(context);

            expect(context.disabled).toBe(true);
        });

        it('should disable request publication action form is dirty', () => {
            context.formik.dirty = true;
            startWorkflowAction.init(context);

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
