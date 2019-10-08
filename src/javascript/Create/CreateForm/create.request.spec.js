import {createNode} from './create.request';

jest.mock('./createForm.gql-mutation', () => {
    return {
        CreateNode: 'CreateNode'
    };
});

describe('createNode', () => {
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
                mutate: jest.fn(() => Promise.resolve({
                    data: {
                        jcr: {
                            modifiedNodes: [{
                                path: '/this/is/sparta'
                            }]
                        }
                    }
                }))
            },
            notificationContext: {notify: jest.fn()},
            actions: {setSubmitting: jest.fn()},
            t: jest.fn(),
            setUrl: jest.fn(),
            data: {
                primaryNodeType: 'jnt:text',
                nodeData: {},
                sections: []
            }
        };
    });

    it('should call CreateNode mutation', async () => {
        await createNode(params);

        expect(params.client.mutate).toHaveBeenCalled();
        expect(params.client.mutate.mock.calls[0][0].mutation).toBe('CreateNode');
    });

    it('should call setUrl function', async () => {
        await createNode(params);

        expect(params.setUrl).toHaveBeenCalled();
        expect(params.client.mutate.mock.calls[0][0].mutation).toBe('CreateNode');
    });

    it('should display a notification when request is a success', async () => {
        await createNode(params);

        expect(params.notificationContext.notify).toHaveBeenCalled();
    });

    it('should display a notification when request is a failure', async () => {
        params.client.mutate = () => Promise.reject();
        await createNode(params);

        expect(params.notificationContext.notify).toHaveBeenCalled();
    });

    it('should log error when request is a failure', async () => {
        const err = new Error('yo');
        params.client.mutate = () => Promise.reject(err);
        await createNode(params);

        expect(console.error).toHaveBeenCalledWith(err);
    });
});
