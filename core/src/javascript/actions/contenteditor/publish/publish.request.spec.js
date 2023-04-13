import {publishNode} from './publishNode';

jest.mock('./publish.gql-mutation', () => {
    return {
        PublishNodeMutation: 'PublishNodeMutation'
    };
});

describe('publish', () => {
    const consoleErrorOriginal = console.error;

    beforeEach(() => {
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = consoleErrorOriginal;
    });

    let params;
    beforeEach(() => {
        params = {
            client: {
                mutate: jest.fn(() => Promise.resolve())
            },
            notificationContext: {notify: jest.fn()},
            actions: {setSubmitting: jest.fn()},
            t: jest.fn(),
            data: {
                nodeData: {}
            }
        };
    });

    it('should call PublishNodeMutation', async () => {
        await publishNode(params);

        expect(params.client.mutate).toHaveBeenCalled();
        expect(params.client.mutate.mock.calls[0][0].mutation).toBe('PublishNodeMutation');
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

    it('should log error when request is a failure', async () => {
        const err = new Error('yo');
        params.client.mutate = () => Promise.reject(err);
        await publishNode(params);

        expect(console.error).toHaveBeenCalledWith(err);
    });
});
