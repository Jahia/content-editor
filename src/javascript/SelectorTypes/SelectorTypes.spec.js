import {registerSelectorTypes, resolveSelectorType} from './SelectorTypes';
import {registry} from '@jahia/ui-extender';
import Category from './Category';
import {Picker} from './Picker/PickerContainer';

describe('Selector Types', () => {
    describe('resolveSelectorType', () => {
        registerSelectorTypes(registry);

        it('should return the proper selector types', () => {
            const selector = resolveSelectorType({selectorType: 'Category'});
            expect(selector.cmp).toEqual(Category);
            expect(selector.supportMultiple).toEqual(true);
            expect(selector.key).toEqual('Category');
        });

        it('should return the proper selector types, when selector type is using resolver', () => {
            let selector = resolveSelectorType({selectorType: 'Picker', selectorOptions: [{name: 'type', value: 'file'}]});
            expect(selector.cmp).toEqual(Picker);
            expect(selector.key).toEqual('ContentPicker');

            selector = resolveSelectorType({selectorType: 'Picker', selectorOptions: [{name: 'type', value: 'editorial'}]});
            expect(selector.cmp).toEqual(Picker);
            expect(selector.key).toEqual('ContentPicker');

            selector = resolveSelectorType({selectorType: 'Picker', selectorOptions: [{name: 'type', value: 'image'}]});
            expect(selector.cmp).toEqual(Picker);
            expect(selector.key).toEqual('MediaPicker');
        });
    });
});
