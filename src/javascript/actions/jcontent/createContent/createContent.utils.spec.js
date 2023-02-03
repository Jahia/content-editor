import {
    childrenLimitReachedOrExceeded,
    flattenNodeTypes,
    getCreatableNodetypesTree,
    transformNodeTypesToActions
} from './createContent.utils';

jest.mock('@jahia/moonstone');
global.contextJsParameters = {config: {contentEditor: {'createChildrenDirectButtons.limit': 3}}};
describe('CreateNewContent utils', () => {
    describe('getActions', () => {
        let client;
        let queryResponse;

        const getActions = async (client, showOnNodeTypes) => {
            return transformNodeTypesToActions(flattenNodeTypes(await getCreatableNodetypesTree(client, 'jnt:page', null, false, '/dummy/path', 'en', ['jmix:studioOnly', 'jmix:hiddenType'], showOnNodeTypes)));
        };

        beforeEach(() => {
            client = {
                query: jest.fn(() => Promise.resolve(queryResponse))
            };

            queryResponse = {
                data: {
                    forms: {
                        contentTypesAsTree: [
                            {
                                name: 'parent',
                                children: [
                                    {name: 'toto'}
                                ]
                            },
                            {
                                name: 'tata',
                                children: []
                            }
                        ]
                    },
                    jcr: {
                        nodeByPath: {
                            isNodeType: true
                        }
                    }
                }
            };
        });

        it('should make a query', async () => {
            await getActions(client);

            expect(client.query).toHaveBeenCalled();
        });

        it('should return empty array when nodetype is not allowed', async () => {
            queryResponse.data.jcr.nodeByPath.isNodeType = false;
            expect(await getActions(client, ['jnt:content'])).toEqual([]);
        });

        it('should return empty array when no contentTypesAsTree is returned', async () => {
            queryResponse.data.forms.contentTypesAsTree = [];
            expect(await getActions(client)).toEqual([]);
        });

        it('should return null when there is more than 3 nodeTypes', async () => {
            queryResponse.data.forms.contentTypesAsTree.push({
                name: 'yolo'
            });
            queryResponse.data.forms.contentTypesAsTree.push({
                name: 'yola'
            });
            expect(await getActions(client)).toEqual(undefined);
        });

        it('should return actions', async () => {
            queryResponse.data.forms.contentTypesAsTree.push({
                name: 'tete'
            });
            const actions = await getActions(client);
            expect(actions[0].key).toEqual('toto');
            expect(actions[1].key).toEqual('tata');
            expect(actions[2].key).toEqual('tete');
            expect(actions.length).toBe(3);
        });

        it('should return actions without jnt:resource', async () => {
            queryResponse.data.forms.contentTypesAsTree.push({
                name: 'jnt:resource'
            });

            const actions = await getActions(client);
            expect(actions[0].key).toEqual('toto');
            expect(actions[1].key).toEqual('tata');
            expect(actions.length).toBe(2);
        });
    });

    let node;
    beforeEach(() => {
        node = {
            'jmix:listSizeLimit': true,
            properties: [{name: 'limit', value: 5}],
            subNodes: {pageInfo: {totalCount: 6}}
        };
    });

    it('should return false when null object', async () => {
        expect(childrenLimitReachedOrExceeded(null)).toBe(false);
    });

    it('should return true if child limit is exceeded', async () => {
        expect(childrenLimitReachedOrExceeded(node)).toBe(true);
        node.subNodes.pageInfo.totalCount = 4;
        expect(childrenLimitReachedOrExceeded(node)).toBe(false);
    });

    it('should return false if jmix:listSizeLimit is false', async () => {
        expect(childrenLimitReachedOrExceeded(node)).toBe(true);
        node['jmix:listSizeLimit'] = false;
        expect(childrenLimitReachedOrExceeded(node)).toBe(false);
    });
});
