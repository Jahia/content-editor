import {getFullLanguageName, getI18nFieldAndValues} from './copyLanguage.utils';

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

    it('test getI18nFieldAndValues should return datas', () => {
        const formAndData = {
            data: {
                forms: {
                    editForm: {
                        sections: [
                            {
                                fieldSets: [
                                    {
                                        fields: [{
                                            name: 'Content',
                                            i18n: true,
                                            multiple: false
                                        }, {
                                            name: 'Description',
                                            i18n: false,
                                            multiple: false
                                        }]
                                    }
                                ]
                            }
                        ]
                    }
                },
                jcr: {
                    result: {
                        properties: [
                            {
                                name: 'Content',
                                value: 'A value'
                            },
                            {
                                name: 'Description',
                                value: 'A value'
                            }
                        ]
                    }
                }
            }
        };

        let result = getI18nFieldAndValues(formAndData);
        expect(result.length).toEqual(1);
        expect(result[0].value).toEqual('A value');
        expect(result[0].multiple).toBeFalsy();
    });

    it('test getI18nFieldAndValues should return empty array', () => {
        const formAndData = {
            data: {
                forms: {
                    editForm: {
                        sections: [
                            {
                                fieldSets: [
                                    {
                                        fields: [{
                                            name: 'Content',
                                            i18n: true
                                        }, {
                                            name: 'Description',
                                            i18n: false
                                        }]
                                    }
                                ]
                            }
                        ]
                    }
                },
                jcr: {
                    result: {
                        properties: [
                            {
                                name: 'The content',
                                value: 'A value'
                            },
                            {
                                name: 'Description',
                                value: 'A value'
                            }
                        ]
                    }
                }
            }
        };

        let result = getI18nFieldAndValues(formAndData);
        expect(result).toEqual([]);
    });
});
