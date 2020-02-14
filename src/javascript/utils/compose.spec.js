import {compose} from './index';

describe('compose', () => {
    it('should compose from last to first function', () => {
        const composedFunction = compose(
            a => a * 2,
            b => b + 1
        );
        expect(composedFunction(10)).toBe(22);
    });
});
