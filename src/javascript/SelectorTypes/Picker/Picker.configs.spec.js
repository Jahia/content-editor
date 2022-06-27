import {registerPickerConfig} from './Picker.configs';
import {getPickerSelectorType} from './Picker.utils';

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
        }
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
});
