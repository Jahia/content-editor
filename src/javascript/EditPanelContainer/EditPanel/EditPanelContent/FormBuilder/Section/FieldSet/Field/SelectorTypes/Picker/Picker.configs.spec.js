import pickerConfigs from './Picker.configs';

describe('Pickers Configs', () => {
    describe('resolveComponent', () => {
        it('should always return a component', () => {
            const cmpDefinition = pickerConfigs.getPickerSelectorType();
            expect(cmpDefinition.cmp).toBeDefined();
            expect(cmpDefinition.key).toBeDefined();
        });
    });
    describe('resolveConfig', () => {
        it('should always return a config', () => {
            const config = pickerConfigs.resolveConfig();
            expect(config).toBeDefined();
        });
        it('should override correctly', () => {
            const field = {valueConstraints: [{value: {string: 'jmix:droppableContent'}}]};
            const config = pickerConfigs.resolveConfig([{name: 'type', value: 'editorial'}], field);
            expect(config.selectableTypesTable).toEqual(['jmix:droppableContent']);
        });
    });
});
