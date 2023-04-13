import {createNode} from './createNode';

jest.mock('./createNode.gql-mutation', () => {
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
                })),
                cache: {
                    flushNodeEntryById: jest.fn()
                }
            },
            notificationContext: {notify: jest.fn()},
            actions: {setSubmitting: jest.fn()},
            t: jest.fn(),
            createCallback: jest.fn(),
            data: {
                primaryNodeType: 'jnt:text',
                nodeData: {},
                sections: [],
                values: {
                    'ce:systemName': 'dummmySystemName'
                },
                i18nContext: {}
            }
        };
    });

    it('should call CreateNode mutation', async () => {
        await createNode(params);

        expect(params.client.mutate).toHaveBeenCalled();
        expect(params.client.mutate.mock.calls[0][0].mutation).toBe('CreateNode');
    });

    it('should call createCallback function', async () => {
        await createNode(params);

        expect(params.createCallback).toHaveBeenCalled();
        expect(params.client.mutate.mock.calls[0][0].mutation).toBe('CreateNode');
    });
});
