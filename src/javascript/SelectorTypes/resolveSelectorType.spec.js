import {registerSelectorTypes} from './registerSelectorTypes';
import {resolveSelectorType} from './resolveSelectorType';
import {registry} from '@jahia/ui-extender';
import {Category} from './Category';
import {Text} from './Text';
import {Picker} from './Picker';
import {ChoiceList} from './ChoiceList';

jest.mock('@jahia/jcontent', () => {
    return {
        FilesQueryHandler: {},
        reactTable: {}
    };
});

describe('Selector Types', () => {
    describe('resolveSelectorType', () => {
        registerSelectorTypes(registry);

        let consoleOutput = [];
        const mockedOutput = output => consoleOutput.push(output);

        beforeEach(() => {
            consoleOutput = [];
            console.warn = mockedOutput;
            console.error = mockedOutput;
        });

        it('should return Text as fallback selector type when the selector type is not provided', () => {
            const selector = resolveSelectorType({name: 'unknownField', displayName: 'The unknown field'});
            expect(selector.cmp).toEqual(Text);
            expect(selector.key).toEqual('Text');

            expect(consoleOutput).toEqual(['Field The unknown field has no selectorType !']);
        });

        it('should return Text as fallback selector type when the selector type is unknown', () => {
            const selector = resolveSelectorType({selectorType: 'UnknownSelectorType'});
            expect(selector.cmp).toEqual(Text);
            expect(selector.key).toEqual('Text');

            expect(consoleOutput).toEqual(['No renderer component for UnknownSelectorType selectorType']);
        });

        it('should return the proper selector types', () => {
            const selector = resolveSelectorType({selectorType: 'Category'});
            expect(selector.cmp).toEqual(Category);
            expect(selector.supportMultiple).toEqual(true);
            expect(selector.key).toEqual('Category');
        });

        it('should return the proper selector types, when selector type is using resolver', () => {
            let selector = resolveSelectorType({
                selectorType: 'Picker',
                selectorOptions: [{name: 'type', value: 'file'}]
            });
            expect(selector.cmp).toEqual(Picker);
            expect(selector.pickerConfig.key).toEqual('file');

            selector = resolveSelectorType({
                selectorType: 'Picker',
                selectorOptions: [{name: 'type', value: 'editorial'}]
            });
            expect(selector.cmp).toEqual(Picker);
            expect(selector.pickerConfig.key).toEqual('editorial');

            selector = resolveSelectorType({selectorType: 'Picker', selectorOptions: [{name: 'type', value: 'image'}]});
            expect(selector.cmp).toEqual(Picker);
            expect(selector.pickerConfig.key).toEqual('image');
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

        it('should get fallback value if the selector option is not password', () => {
            const selector = resolveSelectorType({selectorType: 'Text'});
            expect(selector.cmp).toEqual(Text);
            expect(selector.supportMultiple).toEqual(false);
            expect(selector.key).toEqual('Text');

            const adaptedValue = selector.adaptValue(
                {selectorOptions: [{name: 'optionName'}]},
                {value: 'MyValue'}
            );
            expect(adaptedValue).toEqual('MyValue');
        });

        it('should init value of choicelist if the constraint values have defaultProperty', () => {
            const selector = resolveSelectorType({selectorType: 'Choicelist'});
            expect(selector.cmp).toEqual(ChoiceList);
            expect(selector.supportMultiple).toEqual(true);
            expect(selector.key).toEqual('Choicelist');

            const initValue = selector.initValue({
                valueConstraints: [
                    {
                        value: {string: 'The Value'},
                        properties: [
                            {name: 'prop1', value: 'prop value 1'},
                            {name: 'prop2', value: 'prop value 2'}
                        ]
                    },
                    {
                        value: {string: 'My Expected Value'},
                        properties: [
                            {name: 'prop1', value: 'prop value 1'},
                            {name: 'defaultProperty', value: 'true'},
                            {name: 'prop2', value: 'prop value 2'}
                        ]
                    }
                ]
            });
            expect(initValue).toEqual('My Expected Value');
        });
    });
});
