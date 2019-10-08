import {nodeTypeFormatter} from './create.utils';

describe('Create Utils', () => {
    it('test nodeTypeFormatter', () => {
        const text = {
            input: 'aAbBcCdDeEfF',
            result: 'a-ab-bc-cd-de-ef-f'
        };
        const numbers = {
            input: 'aA1239bB',
            result: 'a-a1239b-b'
        };
        const firstChar = {
            input: 'AaBb',
            result: 'Aa-bb'
        };
        const otherChars = {
            input: 'this iS a * - \\o/ ',
            result: 'this i-s a * - \\o/ '
        };
        const withPrefix = 'xxx:';
        [text, numbers, firstChar, otherChars].forEach(
            test => {
                expect(nodeTypeFormatter(test.input)).toEqual(test.result);
                // With prefix
                expect(nodeTypeFormatter(withPrefix + test.input)).toEqual(test.result);
            }
        );
    });
});
