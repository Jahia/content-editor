import {SelectorTypes} from './SelectorTypes';
import {resolveSelectorType} from './SelectorTypes.utils';
import Text from './Text';
import TextAreaField from './TextArea';

describe('Selector Types', () => {
    describe('resolveSelectorType', () => {
        // Inject dummy selector
        SelectorTypes.dummy = {cmp: Text, key: 'Dummy', supportMultiple: false};
        SelectorTypes.multipleDummy = {cmp: TextAreaField, key: 'MultipleDummy', supportMultiple: true};
        it('should return the proper selector types', () => {
            const selector = resolveSelectorType({selectorType: 'dummy'});
            expect(selector.cmp).toEqual(Text);
        });

        it('should not return the unset multiple selector types', () => {
            const selector = resolveSelectorType({selectorType: 'dummy', multiple: true});
            expect(selector).toEqual(undefined);
        });

        it('should return the proper multiple selector types', () => {
            const selector = resolveSelectorType({selectorType: 'multipleDummy'});
            expect(selector.cmp).toEqual(TextAreaField);
        });

        it('should return the proper multiple selector types', () => {
            const selector = resolveSelectorType({selectorType: 'multipleDummy', multiple: true});
            expect(selector.cmp).toEqual(TextAreaField);
        });
    });
});
