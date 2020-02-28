import {getFullLanguageName} from './copyLanguage.utils';

describe('Copy language Utils', () => {
    it('test getFullLanguageName', () => {
        const languages = [
            {
                displayName: 'Français',
                language: 'fr'
            },
            {
                displayName: 'English',
                language: 'en'
            }
        ];

        expect(getFullLanguageName(languages, 'fr').label).toEqual(languages[0].label);
        expect(getFullLanguageName(languages, 'en').label).toEqual(languages[1].label);
    });
});
