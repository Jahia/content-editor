import {createSite, deleteSite} from '@jahia/cypress';
import {PageComposer} from '../page-object/pageComposer';

describe('Test the text field initializer)', () => {
    const siteKey = 'extFieldInitializerTest';
    const langEN = '"en"';
    const langFR = '"fr"';
    const langDE = '"de"';
    const languages = langEN + ',' + langFR + ',' + langDE;

    before(function () {
        createSite(siteKey, null, null, null, languages);
        cy.runProvisioningScript({fileName: 'provisioning/enableModule.yaml', type: 'application/yaml'});
    });

    after(function () {
        deleteSite(siteKey);
    });

    const checkFieldValues = (contentEditor, fields, lang) => {
        // eslint-disable-next-line guard-for-in
        for (const fieldId in fields) {
            const field = fields[fieldId];
            switch (field.type) {
                case 'smallText':
                    contentEditor.getSmallTextField(fieldId).checkValue(field.values[lang]);
                    break;
                case 'date':
                    contentEditor.getDateField(fieldId).checkValue(field.values[lang]);
                    break;
                default:
                    cy.log('unknown type field');
            }
        }
    };

    const checkValuesDisplayedInPageComposer = (pageComposer, valuesToCheck, lang) => {
        const values = valuesToCheck[lang];
        values.forEach(value => {
            pageComposer.shouldContain(value);
        });
    };

    const editFieldValues = (contentEditor, fields, lang) => {
        // eslint-disable-next-line guard-for-in
        for (const fieldId in fields) {
            const field = fields[fieldId];
            switch (field.type) {
                case 'smallText':
                    contentEditor.getSmallTextField(fieldId).addNewValue(field.values[lang], true);
                    break;
                case 'date':
                    contentEditor.getDateField(fieldId).addNewValue(field.values[lang], true);
                    break;
                default:
                    cy.log('unknown type field');
            }
        }
    };

    it('Verify initial values of the text field initializer', () => {
        const fieldsToCheck = {
            'jnt:textFieldInitializer_defaultString': {
                type: 'smallText',
                values: {
                    en: 'Default string',
                    fr: 'Default string',
                    de: 'Default string'
                }
            },
            'jnt:textFieldInitializer_defaultI18nString': {
                type: 'smallText',
                values: {
                    en: 'Default i18n string',
                    fr: 'Default i18n string',
                    de: 'Default i18n string'
                }
            },
            'jnt:textFieldInitializer_defaultDate': {
                type: 'date',
                values: {
                    en: '07/03/1988 19:40',
                    fr: '07/03/1988 19:40',
                    de: '07/03/1988 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultI18nDate': {
                type: 'date',
                values: {
                    en: '07/03/2006 19:40',
                    fr: '07/03/2006 19:40',
                    de: '07/03/2006 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultStringAutocreated': {
                type: 'smallText',
                values: {
                    en: 'Default string Autocreated',
                    fr: 'Default string Autocreated',
                    de: 'Default string Autocreated'
                }
            },
            'jnt:textFieldInitializer_defaultI18nStringAutocreated': {
                type: 'smallText',
                values: {
                    en: 'Default Autocreated i18n string',
                    fr: 'Default Autocreated i18n string',
                    de: 'Default Autocreated i18n string'
                }
            },
            'jnt:textFieldInitializer_defaultDateAutocreated': {
                type: 'date',
                values: {
                    en: '07/03/2008 19:40',
                    fr: '07/03/2008 19:40',
                    de: '07/03/2008 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultI18nDateAutocreated': {
                type: 'date',
                values: {
                    en: '02/03/2013 19:00',
                    fr: '02/03/2013 19:00',
                    de: '02/03/2013 19:00'
                }
            },
            'jnt:textFieldInitializer_systemRBTitle': {
                type: 'smallText',
                values: {
                    en: 'My settings',
                    fr: 'Mes paramètres',
                    de: 'Meine Einstellungen'
                }
            },
            'jnt:textFieldInitializer_systemI18nRBFirstName': {
                type: 'smallText',
                values: {
                    en: 'First name',
                    fr: 'Prénom',
                    de: 'Vorname'
                }
            },
            'jnt:textFieldInitializer_systemRBAutocreatedPreferredLanguage': {
                type: 'smallText',
                values: {
                    en: 'Preferred language',
                    fr: 'Langue de préférence',
                    de: 'Bevorzugte Sprache'
                }
            },
            'jnt:textFieldInitializer_systemI18nRBAutocreatedMySettings': {
                type: 'smallText',
                values: {
                    en: 'My settings',
                    fr: 'Mes paramètres',
                    de: 'Meine Einstellungen'
                }
            },
            'jnt:textFieldInitializer_moduleRBString': {
                type: 'smallText',
                values: {
                    en: 'This is the default string value',
                    fr: 'This is the default string value',
                    de: 'This is the default string value'
                }
            },
            'jnt:textFieldInitializer_moduleI18nRBString': {
                type: 'smallText',
                values: {
                    en: 'Hello',
                    fr: 'Bonjour',
                    de: 'Guten Tag'
                }
            },
            'jnt:textFieldInitializer_moduleRBAutocreatedString': {
                type: 'smallText',
                values: {
                    en: 'Jahia rocks',
                    fr: 'Jahia rocks',
                    de: 'Jahia rocks'
                }
            },
            'jnt:textFieldInitializer_moduleI18nRBAutocreatedString': {
                type: 'smallText',
                values: {
                    en: 'Kiss',
                    fr: 'Bisous',
                    de: 'Kussen'
                }
            }
        };

        const valuesToCheck = {
            fr: ['1988-03-07T19:40:00.000', '2008-03-07T19:40:00.000', '2013-03-02T19:00:00.000'],
            de: ['1988-03-07T19:40:00.000', '2008-03-07T19:40:00.000', '2013-03-02T19:00:00.000'],
            en: ['1988-03-07T19:40:00.000', '2006-03-07T19:40:00.000', '2008-03-07T19:40:00.000', '2013-03-02T19:00:00.000']
        };

        cy.login();
        const pageComposer = PageComposer.visit(siteKey, 'en', 'home.html');
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('textFieldInitializer')
            .selectContentType('textFieldInitializer')
            .create();
        checkFieldValues(contentEditor, fieldsToCheck, 'en');
        contentEditor.getSmallTextField('mix:title_jcr:title').addNewValue('englishTitle', true);
        contentEditor.getLanguageSwitcher().selectLang('Français');
        checkFieldValues(contentEditor, fieldsToCheck, 'fr');
        contentEditor.getSmallTextField('mix:title_jcr:title').addNewValue('frenchTitle', true);
        contentEditor.getLanguageSwitcher().selectLang('Deutsch');
        checkFieldValues(contentEditor, fieldsToCheck, 'de');
        contentEditor.getSmallTextField('mix:title_jcr:title').addNewValue('deutschTitle', true);
        contentEditor.getLanguageSwitcher().selectLang('English');
        contentEditor.create();
        pageComposer.switchLanguage('Français');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'fr');
        pageComposer.switchLanguage('Deutsch');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'de');
        pageComposer.switchLanguage('English');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'en');
    });

    it('Verify the edition of previous text initializer', () => {
        const fieldsToEdit = {
            'jnt:textFieldInitializer_defaultString': {
                type: 'smallText',
                values: {
                    en: 'Default string edited',
                    fr: 'Default string edited',
                    de: 'Default string edited'
                }
            },
            'jnt:textFieldInitializer_defaultI18nString': {
                type: 'smallText',
                values: {
                    en: 'Default i18n string english',
                    fr: 'Default i18n string français',
                    de: 'Default i18n string deutsch'
                }
            },
            'jnt:textFieldInitializer_defaultDate': {
                type: 'date',
                values: {
                    en: '12/07/1998 19:40',
                    fr: '12/07/1998 19:40',
                    de: '12/07/1998 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultI18nDate': {
                type: 'date',
                values: {
                    en: '12/07/2002 19:40',
                    fr: '12/07/2000 19:40',
                    de: '12/07/2004 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultStringAutocreated': {
                type: 'smallText',
                values: {
                    en: 'Default string Autocreated edited',
                    fr: 'Default string Autocreated edited',
                    de: 'Default string Autocreated edited'
                }
            },
            'jnt:textFieldInitializer_defaultI18nStringAutocreated': {
                type: 'smallText',
                values: {
                    en: 'Default Autocreated i18n string english',
                    fr: 'Default Autocreated i18n string français',
                    de: 'Default Autocreated i18n string deutsch'
                }
            },
            'jnt:textFieldInitializer_defaultDateAutocreated': {
                type: 'date',
                values: {
                    en: '07/03/2009 19:40',
                    fr: '07/03/2009 19:40',
                    de: '07/03/2009 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultI18nDateAutocreated': {
                type: 'date',
                values: {
                    en: '07/05/2008 19:40',
                    fr: '07/04/2008 19:40',
                    de: '07/06/2008 19:40'
                }
            },
            'jnt:textFieldInitializer_systemRBTitle': {
                type: 'smallText',
                values: {
                    en: 'My settings edited',
                    fr: 'My settings edited',
                    de: 'My settings edited'
                }
            },
            'jnt:textFieldInitializer_systemI18nRBFirstName': {
                type: 'smallText',
                values: {
                    en: 'First name english',
                    fr: 'Prénom français',
                    de: 'Vorname deutsch'
                }
            },
            'jnt:textFieldInitializer_systemRBAutocreatedPreferredLanguage': {
                type: 'smallText',
                values: {
                    en: 'Preferred language edited',
                    fr: 'Preferred language edited',
                    de: 'Preferred language edited'
                }
            },
            'jnt:textFieldInitializer_systemI18nRBAutocreatedMySettings': {
                type: 'smallText',
                values: {
                    en: 'My settings english',
                    fr: 'Mes paramètres français',
                    de: 'Meine Einstellungen deutsch'
                }
            },
            'jnt:textFieldInitializer_moduleRBString': {
                type: 'smallText',
                values: {
                    en: 'This is the default string value edited',
                    fr: 'This is the default string value edited',
                    de: 'This is the default string value edited'
                }
            },
            'jnt:textFieldInitializer_moduleI18nRBString': {
                type: 'smallText',
                values: {
                    en: 'Hello english',
                    fr: 'Bonjour français',
                    de: 'Guten Tag deutsch'
                }
            },
            'jnt:textFieldInitializer_moduleRBAutocreatedString': {
                type: 'smallText',
                values: {
                    en: 'Jahia rocks edited',
                    fr: 'Jahia rocks edited',
                    de: 'Jahia rocks edited'
                }
            },
            'jnt:textFieldInitializer_moduleI18nRBAutocreatedString': {
                type: 'smallText',
                values: {
                    en: 'Kiss english',
                    fr: 'Bisous français',
                    de: 'Kussen deutsch'
                }
            }
        };

        const valuesToCheck = {
            fr: ['1998-07-12T19:40:00.000', '2000-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-04-07T19:40:00.000'],
            de: ['1998-07-12T19:40:00.000', '2004-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-06-07T19:40:00.000'],
            en: ['1998-07-12T19:40:00.000', '2002-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-05-07T19:40:00.000']
        };

        cy.login();
        const pageComposer = PageComposer.visit(siteKey, 'en', 'home.html');
        const contentEditor = pageComposer.editComponentByText(' defaultDate:');
        editFieldValues(contentEditor, fieldsToEdit, 'en');
        contentEditor.getLanguageSwitcher().selectLang('Français');
        editFieldValues(contentEditor, fieldsToEdit, 'fr');
        contentEditor.getLanguageSwitcher().selectLang('Deutsch');
        editFieldValues(contentEditor, fieldsToEdit, 'de');
        contentEditor.getLanguageSwitcher().selectLang('English');
        contentEditor.save();
        pageComposer.refresh();
        pageComposer.switchLanguage('Français');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'fr');
        pageComposer.switchLanguage('Deutsch');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'de');
        pageComposer.switchLanguage('English');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'en');
    });

    it('Verify the deletion of previous text initializer', () => {
        const fieldsToEdit = {
            'jnt:textFieldInitializer_defaultDate': {
                type: 'date',
                values: {
                    en: '12/07/1998 19:40',
                    fr: '12/07/1998 19:40',
                    de: '12/07/1998 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultI18nDate': {
                type: 'date',
                values: {
                    en: '12/07/2002 19:40',
                    fr: '12/07/2000 19:40',
                    de: '12/07/2004 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultDateAutocreated': {
                type: 'date',
                values: {
                    en: '07/03/2009 19:40',
                    fr: '07/03/2009 19:40',
                    de: '07/03/2009 19:40'
                }
            },
            'jnt:textFieldInitializer_defaultI18nDateAutocreated': {
                type: 'date',
                values: {
                    en: '07/05/2008 19:40',
                    fr: '07/04/2008 19:40',
                    de: '07/06/2008 19:40'
                }
            }
        };

        const valuesToCheck = {
            fr: ['1998-07-12T19:40:00.000', '2000-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-04-07T19:40:00.000'],
            de: ['1998-07-12T19:40:00.000', '2004-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-06-07T19:40:00.000'],
            en: ['1998-07-12T19:40:00.000', '2002-07-12T19:40:00.000', '2009-03-07T19:40:00.000', '2008-05-07T19:40:00.000']
        };

        cy.login();
        const pageComposer = PageComposer.visit(siteKey, 'en', 'home.html');
        pageComposer.openContextualMenuOnContent('div[path="/sites/extFieldInitializerTest/home/area-main/textfieldinitializer"] div.gwt-HTML.x-component').delete();
        pageComposer.openContextualMenuOnContent('div[path="/sites/extFieldInitializerTest/home/area-main/textfieldinitializer"] div.gwt-HTML.x-component').deletePermanently();
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('textFieldInitializer')
            .selectContentType('textFieldInitializer')
            .create();
        editFieldValues(contentEditor, fieldsToEdit, 'en');
        contentEditor.getLanguageSwitcher().selectLang('Français');
        editFieldValues(contentEditor, fieldsToEdit, 'fr');
        contentEditor.getLanguageSwitcher().selectLang('Deutsch');
        editFieldValues(contentEditor, fieldsToEdit, 'de');
        contentEditor.getLanguageSwitcher().selectLang('English');
        contentEditor.create();
        pageComposer.refresh();
        pageComposer.switchLanguage('Français');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'fr');
        pageComposer.switchLanguage('Deutsch');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'de');
        pageComposer.switchLanguage('English');
        checkValuesDisplayedInPageComposer(pageComposer, valuesToCheck, 'en');
    });
});
