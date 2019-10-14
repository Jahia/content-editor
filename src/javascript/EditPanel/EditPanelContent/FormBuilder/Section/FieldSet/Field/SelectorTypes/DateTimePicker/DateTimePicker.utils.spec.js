import {fillDisabledDaysFromJCRConstraints} from './DateTimePicker.utils';

describe('DateTime picker utils', () => {
    describe('fillDisabledDaysFromJCRConstraints', () => {
        const before = '2019-06-01T00:00:00';
        const beforeTime = '2019-06-01T00:01:00';
        const beforeDay = '2019-06-02T00:00:00';
        const after = '2019-07-01T00:00:00';
        const afterTime = '2019-06-30T23:59:00';
        const afterDay = '2019-06-30T00:00:00';
        const field = ({incBefore, before, after, incAfter}) => {
            return {
                valueConstraints: [
                    {value: {string: incBefore + before + ',' + after + incAfter}}
                ]
            };
        };

        const tests = [{
            input: {
                incBefore: '[', before, after, incAfter: ']'
            },
            result: {
                datetime: [
                    {before: new Date(before)},
                    {after: new Date(after)}
                ],
                date: [
                    {before: new Date(before)},
                    {after: new Date(after)}
                ]
            }
        },
        {
            input: {
                incBefore: '(', before, after, incAfter: ']'
            },
            result: {
                date: [
                    {before: new Date(beforeDay)},
                    {after: new Date(after)}
                ],
                datetime: [
                    {before: new Date(beforeTime)},
                    {after: new Date(after)}
                ]
            }
        },
        {
            input: {
                incBefore: '(', before, after, incAfter: ')'
            },
            result: {
                date: [
                    {before: new Date(beforeDay)},
                    {after: new Date(afterDay)}
                ],
                datetime: [
                    {before: new Date(beforeTime)},
                    {after: new Date(afterTime)}
                ]
            }
        }];
        tests.forEach(test => {
            let testField = field(test.input);
            it('should return the disabledDays on date variant regarding the provided JCR Constraints for ' + testField.valueConstraints[0].value.string, () => {
                expect(fillDisabledDaysFromJCRConstraints(testField, false)).toEqual(test.result.date);
            });
            it('should return the disabledDays on datetime variant regarding the provided JCR Constraints for ' + testField.valueConstraints[0].value.string, () => {
                expect(fillDisabledDaysFromJCRConstraints(testField, true)).toEqual(test.result.datetime);
            });
        });
    });
});
