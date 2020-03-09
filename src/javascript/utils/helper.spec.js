import {truncate} from './index';

describe('truncate', () => {
    it('should truncate string length great then threshold', () => {
        expect(truncate('Florent', 2)).toBe('Fl...');
    });

    it('should not truncate string length smaller then or equals to threshold', () => {
        expect(truncate('Florent', 100)).toBe('Florent');
    });
});
