import {extractRangeConstraints} from '~/utils';

describe('extractRangeConstraints', () => {
    it('should extract range constraints', () => {
        const toTest = [
            {
                entry: '(a,b)', result: {
                    lowerBoundary: 'a',
                    disableLowerBoundary: true,
                    upperBoundary: 'b',
                    disableUpperBoundary: true
                }
            },
            {
                entry: '(a,b]', result: {
                    lowerBoundary: 'a',
                    disableLowerBoundary: true,
                    upperBoundary: 'b',
                    disableUpperBoundary: false
                }
            },
            {
                entry: '[a,b)', result: {
                    lowerBoundary: 'a',
                    disableLowerBoundary: false,
                    upperBoundary: 'b',
                    disableUpperBoundary: true
                }
            },
            {
                entry: '[a,b]', result: {
                    lowerBoundary: 'a',
                    disableLowerBoundary: false,
                    upperBoundary: 'b',
                    disableUpperBoundary: false
                }
            }
        ];
        toTest.forEach(test => expect(extractRangeConstraints(test.entry)).toEqual(test.result));
    });
});
