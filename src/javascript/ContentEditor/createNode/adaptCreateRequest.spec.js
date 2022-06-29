import {Constants} from '~/ContentEditor.constants';
import {adaptCreateRequest} from '~/ContentEditor/createNode/adaptCreateRequest';

describe('adaptCreate', () => {
    it('should adapt create query with system name data', () => {
        let createRequestVariables = {
            properties: [{
                name: Constants.systemName.propertyName,
                value: 'system-name-test'
            }]
        };
        createRequestVariables = adaptCreateRequest(createRequestVariables);
        expect(createRequestVariables.properties.length).toEqual(0);
        expect(createRequestVariables.name).toEqual('system-name-test');
    });
});
