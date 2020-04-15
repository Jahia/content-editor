import {buildFlatFieldObject} from './field.utils';

describe('Field utils', () => {
    describe('buildFlatFieldObject', () => {
        it('should return the object when no array is present', () => {
            const result = buildFlatFieldObject({
                one: 1,
                two: 2
            });

            expect(result).toEqual({
                one: 1,
                two: 2
            });
        });

        it('should flatten the selectorOptions', () => {
            const result = buildFlatFieldObject({
                one: 1,
                selectorOptions: [{name: 'one', value: 1}, {name: 'two', value: 2}],
                two: 2,
                array: [1, 2, 3]
            });

            expect(result).toEqual({
                one: 1,
                selectorOptions: {
                    one: 1,
                    two: 2
                },
                two: 2,
                array: [1, 2, 3]
            });
        });
    });
});
