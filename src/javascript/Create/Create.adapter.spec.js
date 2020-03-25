import {adaptCreateRequest} from './Create.adapter';

describe('adaptCreate', () => {
    it('should adapt create query with system name data', () => {
        let createRequestVariables = {
            properties: [{
                name: 'ce:systemName',
                value: 'system-name-test'
            }]
        };
        createRequestVariables = adaptCreateRequest(createRequestVariables);
        expect(createRequestVariables.properties.length).toEqual(0);
        expect(createRequestVariables.name).toEqual('system-name-test');
    });
});
