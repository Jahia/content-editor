import {saveNode} from './save.request';

jest.mock('./save.gql-mutation', () => {
    return {
        SavePropertiesMutation: 'SavePropertiesMutation'
    };
});

describe('saveNode', () => {
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
            editCallback: jest.fn(),
            data: {
                nodeData: {},
                sections: [],
                values: {}
            }
        };
    });

    it('should call SaveNodeMutation', async () => {
        await saveNode(params);

        expect(params.client.mutate).toHaveBeenCalled();
        expect(params.client.mutate.mock.calls[0][0].mutation).toBe('SavePropertiesMutation');
    });

    it('should call editCallback function', async () => {
        await saveNode(params);

        expect(params.editCallback).toHaveBeenCalled();
    });

    it('should display a notification when request is a success', async () => {
        await saveNode(params);

        expect(params.notificationContext.notify).toHaveBeenCalled();
    });
});
