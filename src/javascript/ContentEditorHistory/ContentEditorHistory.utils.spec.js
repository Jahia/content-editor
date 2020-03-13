import {splitPath} from './ContentEditorHistory.utils';

const tests = [
    {
        input: '/app/lang/mode/uuid',
        result: {currentLanguage: 'lang', currentMode: 'mode', currentUuid: 'uuid', currentRest: ''}
    },
    {
        input: '/app/lang/mode/uuid/xx/yy/',
        result: {currentLanguage: 'lang', currentMode: 'mode', currentUuid: 'uuid', currentRest: '/xx/yy/'}
    },
    {
        input: '/app/lang/mode/uuid/xx/yy',
        result: {currentLanguage: 'lang', currentMode: 'mode', currentUuid: 'uuid', currentRest: '/xx/yy'}
    },
    {
        input: '/app/lang/mode/uuid/xx',
        result: {currentLanguage: 'lang', currentMode: 'mode', currentUuid: 'uuid', currentRest: '/xx'}
    },
    {
        input: '/app/lang/mode/uuid/',
        result: {currentLanguage: 'lang', currentMode: 'mode', currentUuid: 'uuid', currentRest: '/'}
    }
];

describe('splitPath test', () => {
    tests.forEach(test => {
        it(`should split "${test.input}" properly`, () => {
            expect(splitPath(test.input)).toEqual(test.result);
        });
    });
});
