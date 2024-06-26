import {JContent} from '../page-object/jcontent';
import {SmallTextField} from '../page-object/fields';
import {Button, getComponentByRole} from '@jahia/cypress';

describe('Content editor form', () => {
    let jcontent: JContent;

    before(function () {
        cy.executeGroovy('createSite.groovy', {SITEKEY: 'contentEditorSite'});
    });

    after(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: 'contentEditorSite'});
    });

    beforeEach(() => {
        cy.loginEditor();
        jcontent = JContent.visit('contentEditorSite', 'en', 'content-folders/contents');
    });

    it('Should display custom title label and error message', function () {
        const contentEditor = jcontent.createContent('testOverride');
        const field = contentEditor.getField(SmallTextField, 'cent:testOverride_jcr:title', false);

        field.get().find('label').should('contain', 'My title 1234');

        field.get().find('span').should('contain', 'Custom title');
        field.get().find('span em').should('exist').and('contain', 'italic');
        field.get().find('span script').should('not.exist');

        field.addNewValue('123456789012', true);
        getComponentByRole(Button, 'createButton').click();
        cy.get('[data-sel-role=dialog-errorBeforeSave]').contains('My title 1234');
        getComponentByRole(Button, 'content-type-dialog-cancel').click();
        cy.contains('My constraint message 1234');
    });

    it('Should display overridden title label for boolean buttons', function () {
        const contentEditor = jcontent.createContent('mesiHeaderBanner');
        const field = contentEditor.getField(Field, 'jmix:mesiBannerStory_buttonTransverse', false);
        field.get().find('label').should('contain', 'Contribuer le bouton transverse Header ?');
    });
});
