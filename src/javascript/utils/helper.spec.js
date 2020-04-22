import {truncate, encodeSystemName, decodeSystemName} from './index';

describe('truncate', () => {
    it('should truncate string length great then threshold', () => {
        expect(truncate('Florent', 2)).toBe('Fl...');
    });

    it('should not truncate string length smaller then or equals to threshold', () => {
        expect(truncate('Florent', 100)).toBe('Florent');
    });
});

describe('System name encoding/decoding', () => {
    it('Should encode system name', () => {
        expect(encodeSystemName('test-system-name-classic')).toBe('test-system-name-classic');
        expect(encodeSystemName('invalid-chars-/:[]|*%')).toBe('invalid-chars-%3A%5B%5D%7C%2A%25');
        // %9A is used to encode manually '*' it should be handled correctly
        expect(encodeSystemName('enforce-test-%9A')).toBe('enforce-test-%259A');
    });

    it('should decode system name', () => {
        expect(decodeSystemName('test-system-name-classic')).toBe('test-system-name-classic');
        expect(decodeSystemName('invalid-chars-%3A%5B%5D%7C%2A%25')).toBe('invalid-chars-:[]|*%');
        // %9A is used to encode manually '*' it should be handled correctly
        expect(decodeSystemName('enforce-test-%259A')).toBe('enforce-test-%9A');
    });
});
