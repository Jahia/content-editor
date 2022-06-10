import {updateNode} from './updateNode';

jest.mock('./updateNode.gql-mutation', () => {
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

    const mutation = {
        data: {
            jcr: {
                mutateNode: {
                    node: {}
                }
            }
        }
    };
    beforeEach(() => {
        params = {
            client: {
                mutate: jest.fn(() => Promise.resolve(mutation)),
                cache: {
                    flushNodeEntryById: jest.fn()
                }
            },
            notificationContext: {notify: jest.fn()},
            actions: {setSubmitting: jest.fn()},
            t: jest.fn(),
            editCallback: jest.fn(),
            data: {
                nodeData: {primaryNodeType: {}},
                sections: [],
                values: {},
                i18nContext: {}
            }
        };
    });

    it('should call SaveNodeMutation', async () => {
        await updateNode(params);

        expect(params.client.mutate).toHaveBeenCalled();
        expect(params.client.mutate.mock.calls[0][0].mutation).toBe('SavePropertiesMutation');
    });

    it('should call editCallback function', async () => {
        await updateNode(params);

        expect(params.editCallback).toHaveBeenCalled();
    });
});
