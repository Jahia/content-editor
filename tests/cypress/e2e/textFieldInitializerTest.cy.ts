import {createSite, deleteSite, enableModule} from '@jahia/cypress';
import {PageComposer} from '../page-object/pageComposer';
import {SmallTextField, DateField} from '../page-object/fields';

describe('Test the text field initializer', () => {
    const siteKey = 'extFieldInitializerTest';
    const langEN = 'en';
    const langFR = 'fr';
    const langDE = 'de';
    const languages = langEN + ',' + langFR + ',' + langDE;
    const siteConfig = {
        languages: languages,
        templateSet: 'dx-base-demo-templates',
        serverName: 'localhost',
        locale: langEN
    };

    before(function () {
        createSite(siteKey, siteConfig);
        enableModule('content-editor-test-module', siteKey);
    });

    after(function () {
        deleteSite(siteKey);
    });

    const checkFieldValues = (contentEditor, fields, lang) => {
        fields.forEach(field => {
            contentEditor.getField(SmallTextField, field.key).checkValue(field.values[lang]);
        });
    };

    const checkValuesDisplayedInPageComposer = (pageComposer, valuesToCheck, lang) => {
        const values = valuesToCheck[lang];
        values.forEach(value => {
            pageComposer.shouldContain(value);
        });
    };

    const editFieldValues = (contentEditor, fields, lang) => {
        fields.forEach(field => {
            contentEditor.getField(field.type, field.key).addNewValue(field.values[lang], true);
        });
    };

    const testValuesInPageComposer = (pageComposer, valuesToCheck, languagesToCheck) => {
        const langData = {
            [langFR]: 'Français',
            [langDE]: 'Deutsch',
            [langEN]: 'English'
        };

        languagesToCheck.forEach(lang => {
            const data = langData[lang];

            if (!data) {
                console.log(`Unsupported language: ${lang}`);
                return;
            }

            pageComposer.switchLanguage(data);
            checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, lang);
        });
    };

    it('Check text field initializer', () => {
        cy.log('Create en check initial values of extFieldInitializerTest content');

        const initialFields = [
            {
                key: 'cent:textFieldInitializer_defaultString',
                type: SmallTextField,
                values: {
                    en: 'Default string',
                    fr: 'Default string',
                    de: 'Default string'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nString',
                type: SmallTextField,
                values: {
                    en: 'Default i18n string',
                    fr: 'Default i18n string',
                    de: 'Default i18n string'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultDate',
                type: DateField,
                values: {
                    en: '03/07/1988 19:40',
                    fr: '03/07/1988 19:40',
                    de: '03/07/1988 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nDate',
                type: DateField,
                values: {
                    en: '03/07/2006 19:40',
                    fr: '03/07/2006 19:40',
                    de: '03/07/2006 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultStringAutocreated',
                type: SmallTextField,
                values: {
                    en: 'Default string Autocreated',
                    fr: 'Default string Autocreated',
                    de: 'Default string Autocreated'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nStringAutocreated',
                type: SmallTextField,
                values: {
                    en: 'Default Autocreated i18n string',
                    fr: 'Default Autocreated i18n string',
                    de: 'Default Autocreated i18n string'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultDateAutocreated',
                type: DateField,
                values: {
                    en: '03/07/2008 19:40',
                    fr: '03/07/2008 19:40',
                    de: '03/07/2008 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nDateAutocreated',
                type: DateField,
                values: {
                    en: '03/02/2013 19:00',
                    fr: '03/02/2013 19:00',
                    de: '03/02/2013 19:00'
                }
            },
            {
                key: 'cent:textFieldInitializer_systemRBTitle',
                type: SmallTextField,
                values: {
                    en: 'My settings',
                    fr: 'Mes paramètres',
                    de: 'Meine Einstellungen'
                }
            },
            {
                key: 'cent:textFieldInitializer_systemI18nRBFirstName',
                type: SmallTextField,
                values: {
                    en: 'First name',
                    fr: 'Prénom',
                    de: 'Vorname'
                }
            },
            {
                key: 'cent:textFieldInitializer_systemRBAutocreatedPreferredLanguage',
                type: SmallTextField,
                values: {
                    en: 'Preferred language',
                    fr: 'Langue de préférence',
                    de: 'Bevorzugte Sprache'
                }
            },
            {
                key: 'cent:textFieldInitializer_systemI18nRBAutocreatedMySettings',
                type: SmallTextField,
                values: {
                    en: 'My settings',
                    fr: 'Mes paramètres',
                    de: 'Meine Einstellungen'
                }
            },
            {
                key: 'cent:textFieldInitializer_moduleRBString',
                type: SmallTextField,
                values: {
                    en: 'This is the default string value',
                    fr: 'This is the default string value',
                    de: 'This is the default string value'
                }
            },
            {
                key: 'cent:textFieldInitializer_moduleI18nRBString',
                type: SmallTextField,
                values: {
                    en: 'Hello',
                    fr: 'Bonjour',
                    de: 'Guten Tag'
                }
            },
            {
                key: 'cent:textFieldInitializer_moduleRBAutocreatedString',
                type: SmallTextField,
                values: {
                    en: 'Jahia rocks',
                    fr: 'Jahia rocks',
                    de: 'Jahia rocks'
                }
            },
            {
                key: 'cent:textFieldInitializer_moduleI18nRBAutocreatedString',
                type: SmallTextField,
                values: {
                    en: 'Kiss',
                    fr: 'Bisous',
                    de: 'Kussen'
                }
            }
        ];

        const initialDisplayedValues = {
            fr: ['1988-03-07T19:40:00.000', '2008-03-07T19:40:00.000', '2013-03-02T19:00:00.000'],
            de: ['1988-03-07T19:40:00.000', '2008-03-07T19:40:00.000', '2013-03-02T19:00:00.000'],
            en: ['1988-03-07T19:40:00.000', '2006-03-07T19:40:00.000', '2008-03-07T19:40:00.000', '2013-03-02T19:00:00.000']
        };

        cy.login();
        const pageComposer = PageComposer.visit(siteKey, langEN, 'home.html');
        const contentEditorToCreate = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('textFieldInitializer')
            .selectContentType('textFieldInitializer')
            .create();
        checkFieldValues(contentEditorToCreate, initialFields, langEN);
        contentEditorToCreate.getSmallTextField('mix:title_jcr:title').addNewValue('englishTitle', true);
        contentEditorToCreate.getLanguageSwitcher().selectLang('Français');
        checkFieldValues(contentEditorToCreate, initialFields, langFR);
        contentEditorToCreate.getSmallTextField('mix:title_jcr:title').addNewValue('frenchTitle', true);
        contentEditorToCreate.getLanguageSwitcher().selectLang('Deutsch');
        checkFieldValues(contentEditorToCreate, initialFields, langDE);
        contentEditorToCreate.getSmallTextField('mix:title_jcr:title').addNewValue('deutschTitle', true);
        contentEditorToCreate.getLanguageSwitcher().selectLang('English');
        contentEditorToCreate.create();
        testValuesInPageComposer(pageComposer, initialDisplayedValues, [langFR, langDE, langEN]);

        cy.log('Edit and save textFieldInitializerTest content');

        const editFields = [
            {
                key: 'cent:textFieldInitializer_defaultString',
                type: SmallTextField,
                values: {
                    en: 'Default string edited',
                    fr: 'Default string edited',
                    de: 'Default string edited'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nString',
                type: SmallTextField,
                values: {
                    en: 'Default i18n string english',
                    fr: 'Default i18n string français',
                    de: 'Default i18n string deutsch'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultDate',
                type: DateField,
                values: {
                    en: '07/12/1998 19:40',
                    fr: '07/12/1998 19:40',
                    de: '07/12/1998 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nDate',
                type: DateField,
                values: {
                    en: '07/12/2002 19:40',
                    fr: '07/12/2000 19:40',
                    de: '07/12/2004 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultStringAutocreated',
                type: SmallTextField,
                values: {
                    en: 'Default string Autocreated edited',
                    fr: 'Default string Autocreated edited',
                    de: 'Default string Autocreated edited'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nStringAutocreated',
                type: SmallTextField,
                values: {
                    en: 'Default Autocreated i18n string english',
                    fr: 'Default Autocreated i18n string français',
                    de: 'Default Autocreated i18n string deutsch'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultDateAutocreated',
                type: DateField,
                values: {
                    en: '03/07/2009 19:40',
                    fr: '03/07/2009 19:40',
                    de: '03/07/2009 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nDateAutocreated',
                type: DateField,
                values: {
                    en: '05/07/2008 19:40',
                    fr: '04/07/2008 19:40',
                    de: '06/07/2008 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_systemRBTitle',
                type: SmallTextField,
                values: {
                    en: 'My settings edited',
                    fr: 'My settings edited',
                    de: 'My settings edited'
                }
            },
            {
                key: 'cent:textFieldInitializer_systemI18nRBFirstName',
                type: SmallTextField,
                values: {
                    en: 'First name english',
                    fr: 'Prénom français',
                    de: 'Vorname deutsch'
                }
            },
            {
                key: 'cent:textFieldInitializer_systemRBAutocreatedPreferredLanguage',
                type: SmallTextField,
                values: {
                    en: 'Preferred language edited',
                    fr: 'Preferred language edited',
                    de: 'Preferred language edited'
                }
            },
            {
                key: 'cent:textFieldInitializer_systemI18nRBAutocreatedMySettings',
                type: SmallTextField,
                values: {
                    en: 'My settings english',
                    fr: 'Mes paramètres français',
                    de: 'Meine Einstellungen deutsch'
                }
            },
            {
                key: 'cent:textFieldInitializer_moduleRBString',
                type: SmallTextField,
                values: {
                    en: 'This is the default string value edited',
                    fr: 'This is the default string value edited',
                    de: 'This is the default string value edited'
                }
            },
            {
                key: 'cent:textFieldInitializer_moduleI18nRBString',
                type: SmallTextField,
                values: {
                    en: 'Hello english',
                    fr: 'Bonjour français',
                    de: 'Guten Tag deutsch'
                }
            },
            {
                key: 'cent:textFieldInitializer_moduleRBAutocreatedString',
                type: SmallTextField,
                values: {
                    en: 'Jahia rocks edited',
                    fr: 'Jahia rocks edited',
                    de: 'Jahia rocks edited'
                }
            },
            {
                key: 'cent:textFieldInitializer_moduleI18nRBAutocreatedString',
                type: SmallTextField,
                values: {
                    en: 'Kiss english',
                    fr: 'Bisous français',
                    de: 'Kussen deutsch'
                }
            }
        ];

        const displayedValues = {
            fr: ['1998-07-12T19:40:00.000', '2000-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-04-07T19:40:00.000'],
            de: ['1998-07-12T19:40:00.000', '2004-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-06-07T19:40:00.000'],
            en: ['1998-07-12T19:40:00.000', '2002-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-05-07T19:40:00.000']
        };

        const contentEditorToEdit = pageComposer.editComponentByText(' defaultDate:');

        editFieldValues(contentEditorToEdit, editFields, langEN);
        contentEditorToEdit.getLanguageSwitcher().selectLang('Français');
        editFieldValues(contentEditorToEdit, editFields, langFR);
        contentEditorToEdit.getLanguageSwitcher().selectLang('Deutsch');
        editFieldValues(contentEditorToEdit, editFields, langDE);
        contentEditorToEdit.getLanguageSwitcher().selectLang('English');
        contentEditorToEdit.save();
        pageComposer.refresh();
        testValuesInPageComposer(pageComposer, displayedValues, [langFR, langDE, langEN]);

        cy.log('Delete previous extFieldInitializerTest content');
        pageComposer.openContextualMenuOnContent('div[path="/sites/extFieldInitializerTest/home/area-main/englishtitle"] div.gwt-HTML.x-component').delete();
        pageComposer.openContextualMenuOnContent('div[path="/sites/extFieldInitializerTest/home/area-main/englishtitle"] div.gwt-HTML.x-component').deletePermanently();

        cy.log('Create en check new extFieldInitializerTest content');

        const newEditFields = [
            {
                key: 'cent:textFieldInitializer_defaultDate',
                type: DateField,
                values: {
                    en: '07/12/1998 19:40',
                    fr: '07/12/1998 19:40',
                    de: '07/12/1998 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nDate',
                type: DateField,
                values: {
                    en: '07/12/2002 19:40',
                    fr: '07/12/2000 19:40',
                    de: '07/12/2004 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultDateAutocreated',
                type: DateField,
                values: {
                    en: '03/07/2009 19:40',
                    fr: '03/07/2009 19:40',
                    de: '03/07/2009 19:40'
                }
            },
            {
                key: 'cent:textFieldInitializer_defaultI18nDateAutocreated',
                type: DateField,
                values: {
                    en: '05/07/2008 19:40',
                    fr: '04/07/2008 19:40',
                    de: '06/07/2008 19:40'
                }
            }
        ];

        const newDisplayedValues = {
            fr: ['1998-07-12T19:40:00.000', '2000-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-04-07T19:40:00.000'],
            de: ['1998-07-12T19:40:00.000', '2004-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-06-07T19:40:00.000'],
            en: ['1998-07-12T19:40:00.000', '2002-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-05-07T19:40:00.000']
        };

        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('textFieldInitializer')
            .selectContentType('textFieldInitializer')
            .create();
        editFieldValues(contentEditor, newEditFields, langEN);
        contentEditor.getLanguageSwitcher().selectLang('Français');
        editFieldValues(contentEditor, newEditFields, langFR);
        contentEditor.getLanguageSwitcher().selectLang('Deutsch');
        editFieldValues(contentEditor, newEditFields, langDE);
        contentEditor.getLanguageSwitcher().selectLang('English');
        contentEditor.create();
        pageComposer.refresh();
        testValuesInPageComposer(pageComposer, newDisplayedValues, [langFR, langDE, langEN]);
    });
});
