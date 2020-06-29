import {registerSelectorTypes, resolveSelectorType} from './SelectorTypes';
import {registry} from '@jahia/ui-extender';
import Category from './Category';
import Text from './Text';
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

        it('should adapt value if the selector option is password', () => {
            const selector = resolveSelectorType({selectorType: 'Text'});
            expect(selector.cmp).toEqual(Text);
            expect(selector.supportMultiple).toEqual(false);
            expect(selector.key).toEqual('Text');

            const adaptedValue = selector.adaptValue(
                {selectorOptions: [{name: 'password'}]},
                {decryptedValue: 'thisIs@MyValue'}
            );
            expect(adaptedValue).toEqual('thisIs@MyValue');
        });

        it('should adapt value in case of multiple if the selector option is password', () => {
            const selector = resolveSelectorType({selectorType: 'Text'});
            expect(selector.key).toEqual('Text');

            const adaptedValue = selector.adaptValue(
                {multiple: true, selectorOptions: [{name: 'password'}]},
                {decryptedValues: ['thisIs@MyValue', 'thisIs@MySecond>Value']}
            );
            expect(adaptedValue).toEqual(['thisIs@MyValue', 'thisIs@MySecond>Value']);
        });

        it('should not adapt value if the selector option is not password', () => {
            const selector = resolveSelectorType({selectorType: 'Text'});
            expect(selector.cmp).toEqual(Text);
            expect(selector.supportMultiple).toEqual(false);
            expect(selector.key).toEqual('Text');

            const adaptedValue = selector.adaptValue(
                {selectorOptions: [{name: 'optionName'}]},
                {value: 'MyValue'}
            );
            expect(adaptedValue).toEqual(undefined);
        });
    });
});
