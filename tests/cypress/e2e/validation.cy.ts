import {createSite, deleteSite, enableModule} from '@jahia/cypress';
import {JContent} from '../page-object/jcontent';
import {SmallTextField} from '../page-object/fields';

describe('Test the text field initializer', {testIsolation: false}, () => {
    const siteKey = 'validation';
    let jcontent : JContent;

    before(function () {
        createSite(siteKey);
        enableModule('jcontent-test-module', siteKey);
        cy.login();
        jcontent = JContent
            .visit(siteKey, 'en', 'content-folders/contents')
            .switchToListMode();
    });

    after(function () {
        deleteSite(siteKey);
    });

    it('should handle constraint on create/normal prop', () => {
        const ce = jcontent.createContent('textFieldInitializer');
        ce.getField(SmallTextField, 'nt:base_ce:systemName', false).addNewValue('test-validator-shared');
        ce.getField(SmallTextField, 'cent:textFieldInitializer_defaultString', false).clearValue();
        ce.createUnchecked();
        cy.contains('There is one validation error');
        ce.getField(SmallTextField, 'cent:textFieldInitializer_defaultString', false).addNewValue('1234');
        ce.create();
    });

    it('should handle constraint on edit/normal prop', () => {
        const ce = jcontent.editComponentByText('test-validator-shared');
        ce.getField(SmallTextField, 'cent:textFieldInitializer_defaultString', false).clearValue();
        ce.saveUnchecked();
        cy.contains('There is one validation error');
        ce.getField(SmallTextField, 'cent:textFieldInitializer_defaultString', false).addNewValue('12345');
        ce.save();
    });

    it('should handle constraint on create/i18n prop', () => {
        const ce = jcontent.createContent('textFieldInitializer');
        ce.getField(SmallTextField, 'nt:base_ce:systemName', false).addNewValue('test-validator-i18n');
        ce.getField(SmallTextField, 'cent:textFieldInitializer_defaultI18nString', false).addNewValue('1');
        ce.createUnchecked();
        cy.contains('There is one validation error');
        ce.getField(SmallTextField, 'cent:textFieldInitializer_defaultI18nString', false).addNewValue('1234');
        ce.create();
    });

    it('should handle constraint on edit/i18n prop', () => {
        const ce = jcontent.editComponentByText('test-validator-i18n');
        ce.getField(SmallTextField, 'cent:textFieldInitializer_defaultI18nString', false).addNewValue('12');
        ce.saveUnchecked();
        cy.contains('There is one validation error');
        ce.getField(SmallTextField, 'cent:textFieldInitializer_defaultI18nString', false).addNewValue('12345');
        ce.save();
    });
});
