import {unpublishNode} from './unpublish.redux-actions';

jest.mock('./unpublish.gql-mutation', () => {
    return {
        UnpublishNodeMutation: 'UnpublishNodeMutation'
    };
});

describe('unpublish', () => {
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
            nodeData: {},
            notificationContext: {notify: jest.fn()},
            actions: {setSubmitting: jest.fn()},
            t: jest.fn()
        };
    });

    it('should call UnpublishNodeMutation', async () => {
        await unpublishNode(params);

        expect(params.client.mutate).toHaveBeenCalled();
        expect(params.client.mutate.mock.calls[0][0].mutation).toBe('UnpublishNodeMutation');
    });

    it('should display a notification when request is a success', async () => {
        await unpublishNode(params);

        expect(params.notificationContext.notify).toHaveBeenCalled();
    });

    it('should display a notification when request is a failure', async () => {
        params.client.mutate = () => Promise.reject();
        await unpublishNode(params);

        expect(params.notificationContext.notify).toHaveBeenCalled();
    });

    it('should log error when request is a failure', async () => {
        const err = new Error('yo');
        params.client.mutate = () => Promise.reject(err);
        await unpublishNode(params);

        expect(console.error).toHaveBeenCalledWith(err);
    });
});
