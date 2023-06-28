import {createSite, deleteSite, enableModule} from '@jahia/cypress';
import {PageComposer} from '../page-object/pageComposer';
import {SmallTextField} from '../page-object/fields';

describe('Test the consistency of the validation of regular expressions added to the definition', () => {
    const siteKey = 'regexpTest';
    const langEN = 'en';
    const siteConfig = {
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

    const editFieldValues = (contentEditor, fields, lang) => {
        fields.forEach(field => {
            contentEditor.getField(field.type, field.key).addNewValue(field.values[lang], true);
        });
    };

    const checkInvalidPatternErrorMsg = (fields, lang) => {
        fields.forEach(field => {
            cy.get('div[data-sel-content-editor-field="' + field.key + '"] div.flexFluid p[data-sel-error="invalidPattern"]').should('contain', field.values[lang]);
        });
    };

    it('Check consistencies of RegExp validation pattern', () => {
        cy.log('Create testRegExp and check values validation pattern');

        cy.login();
        const pageComposer = PageComposer.visit(siteKey, langEN, 'home.html');
        const contentEditorToCreate = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('testRegExp')
            .selectContentType('testRegExp')
            .create();
        contentEditorToCreate.getSmallTextField('cent:testRegExp_badge').addNewValue('badge01', true);
        contentEditorToCreate.getSmallTextField('cent:testRegExp_comment').addNewValue('my comment', true);
        contentEditorToCreate.create();
        pageComposer.refresh().shouldContain('cent:testRegExp');

        cy.log('Edit testRegExp and check the custom error messages for the invalid pattern');

        const editFields = [
            {
                key: 'cent:testRegExp_badge',
                type: SmallTextField,
                values: {
                    en: 'bad value for "badge"'
                }
            },
            {
                key: 'cent:testRegExp_comment',
                type: SmallTextField,
                values: {
                    en: 'Exceeding the number of characters allowed for comments'
                }
            }
        ];

        const invalidPatternMsgError = [
            {
                key: 'cent:testRegExp_badge',
                values: {
                    en: 'Only alphanumeric characters are allowed'
                }
            },
            {
                key: 'cent:testRegExp_comment',
                values: {
                    en: 'Only 15 characters are allowed'
                }
            }
        ];

        const contentEditorToEdit = pageComposer.editComponentByText(' testregexp');

        editFieldValues(contentEditorToEdit, editFields, langEN);
        cy.get('body').click();
        checkInvalidPatternErrorMsg(invalidPatternMsgError, langEN);
    });
});
