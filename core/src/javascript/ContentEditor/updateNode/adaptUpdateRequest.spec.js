import {Constants} from '~/ContentEditor.constants';
import {adaptUpdateRequest} from '~/ContentEditor/updateNode/adaptUpdateRequest';

describe('adaptSaveRequest', () => {
    it('should not rename node if system name not changed', () => {
        const nodeData = {
            name: 'dummy',
            primaryNodeType: {
                displayName: 'ContentType',
                name: 'jcr:contentType'
            }
        };

        let saveRequestVariables = {
            propertiesToSave: [{
                name: Constants.systemName.propertyName,
                value: 'dummy'
            }]
        };

        saveRequestVariables = adaptUpdateRequest(nodeData, saveRequestVariables);

        expect(saveRequestVariables.propertiesToSave.length).toEqual(0);
        expect(saveRequestVariables.shouldRename).toEqual(false);
    });

    it('should rename node if system name changed', () => {
        const nodeData = {
            name: 'dummy',
            primaryNodeType: {
                displayName: 'ContentType',
                name: 'jcr:contentType'
            }
        };

        let saveRequestVariables = {
            propertiesToSave: [{
                name: Constants.systemName.propertyName,
                value: 'dummy_updated'
            }]
        };

        saveRequestVariables = adaptUpdateRequest(nodeData, saveRequestVariables);

        expect(saveRequestVariables.propertiesToSave.length).toEqual(0);
        expect(saveRequestVariables.shouldRename).toEqual(true);
        expect(saveRequestVariables.newName).toEqual('dummy_updated');
    });

    it('should not rename node if system name not changed and system name contains specials characters', () => {
        const nodeData = {
            name: 'dummy%2A',
            primaryNodeType: {
                displayName: 'ContentType',
                name: 'jcr:contentType'
            }
        };

        let saveRequestVariables = {
            propertiesToSave: [{
                name: Constants.systemName.propertyName,
                value: 'dummy*'
            }]
        };

        saveRequestVariables = adaptUpdateRequest(nodeData, saveRequestVariables);

        expect(saveRequestVariables.propertiesToSave.length).toEqual(0);
        expect(saveRequestVariables.shouldRename).toEqual(false);
    });
});
