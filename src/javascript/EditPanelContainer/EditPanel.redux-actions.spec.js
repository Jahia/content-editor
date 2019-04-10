import {publishNode, saveNode} from './EditPanel.redux-actions';

jest.mock('./NodeData/NodeData.gql-mutation', () => {
    return {
        PublishPropertiesMutation: 'PublishPropertiesMutation',
        SavePropertiesMutation: 'SavePropertiesMutation'
    };
});

describe('EditPanel redux actions', () => {
    describe('publish', () => {
        let params;
        beforeEach(() => {
            params = {
                client: {
                    mutate: jest.fn(() => Promise.resolve())
                },
                nodeData: {},
                notificationContext: {notify: jest.fn()},
                actions: {setSubmitting: jest.fn()},
                t: jest.fn()
            };
        });

        it('should call PublishPropertiesMutation', async () => {
            await publishNode(params);

            expect(params.client.mutate).toHaveBeenCalled();
            expect(params.client.mutate.mock.calls[0][0].mutation).toBe('PublishPropertiesMutation');
        });

        it('should display a notification when request is a success', async () => {
            await publishNode(params);

            expect(params.notificationContext.notify).toHaveBeenCalled();
        });

        it('should display a notification when request is a failure', async () => {
            params.client.mutate = () => Promise.reject();
            await publishNode(params);

            expect(params.notificationContext.notify).toHaveBeenCalled();
        });
    });

    describe('saveNode', () => {
        let params;
        beforeEach(() => {
            params = {
                client: {
                    mutate: jest.fn(() => Promise.resolve())
                },
                nodeData: {},
                notificationContext: {notify: jest.fn()},
                actions: {setSubmitting: jest.fn()},
                t: jest.fn()
            };
        });

        it('should call PublishPropertiesMutation', async () => {
            await saveNode(params);

            expect(params.client.mutate).toHaveBeenCalled();
            expect(params.client.mutate.mock.calls[0][0].mutation).toBe('SavePropertiesMutation');
        });

        it('should display a notification when request is a success', async () => {
            await saveNode(params);

            expect(params.notificationContext.notify).toHaveBeenCalled();
        });

        it('should display a notification when request is a failure', async () => {
            params.client.mutate = () => Promise.reject();
            await saveNode(params);

            expect(params.notificationContext.notify).toHaveBeenCalled();
        });
    });
});
