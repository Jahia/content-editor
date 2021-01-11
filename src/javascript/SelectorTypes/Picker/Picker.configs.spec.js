import {getPickerSelectorType, registerPickerConfig, resolveConfig} from './Picker.configs';

jest.mock('@jahia/ui-extender', () => {
    return {
        registry: {
            get: jest.fn(() => {
                return {
                    cmp: {
                        picker: {
                            cmp: {},
                            key: 'ContentPicker'
                        }
                    }
                };
            }),
            add: jest.fn()
        },
    };
});
describe('Pickers Configs', () => {
    describe('resolveComponent', () => {
        it('should always return a component', () => {
            registerPickerConfig({
                add: jest.fn(() => {
                }),
                get: jest.fn(() => {
                    return {cmp: {picker: {}}};
                })
            });
            const cmpDefinition = getPickerSelectorType();
            expect(cmpDefinition.cmp).toBeDefined();
            expect(cmpDefinition.key).toBeDefined();
        });
    });
    describe('resolveConfig', () => {
        it('should always return a config', () => {
            const config = resolveConfig();
            expect(config).toBeDefined();
        });
        it('should override correctly', () => {
            const field = {valueConstraints: [{value: {string: 'jmix:droppableContent'}}]};
            const config = resolveConfig([{name: 'type', value: 'editorial'}], field);
            expect(config.selectableTypesTable).toEqual(['jmix:droppableContent']);
        });
    });
});
