import {JContent} from '../page-object/jcontent';
import {ContentEditor} from '../page-object';

describe('Editor url test', () => {
    let jcontent: JContent;
    let contentEditor: ContentEditor;
    const peopleFirstUrl = `${Cypress.env('JAHIA_URL')}/jahia/jcontent/digitall/en/pages/home#(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:en,mode:edit,site:digitall,uilang:en,uuid:\'8cc9b843-7340-4533-a150-50ae0b771c84\')))`;

    beforeEach(() => {
        cy.loginEditor();
    });

    after(() => {
        cy.logout();
    });

    it('Should open editor upon login', function () {
        cy.logout();
        cy.visit(peopleFirstUrl);
        cy.get('input[name="username"]').type('root', {force: true});
        cy.get('input[name="password"]').type('root1234', {force: true});
        cy.get('button[type="submit"]').click({force: true});
        cy.get('h1').contains('People First').should('exist');
        contentEditor = ContentEditor.getContentEditor();
        contentEditor.cancel();
        cy.get('span').contains('People First').should('exist');
    });

    it('Should open editor already logged in', function () {
        cy.visit(peopleFirstUrl);
        cy.get('h1').contains('People First').should('exist');
        contentEditor = ContentEditor.getContentEditor();
        contentEditor.cancel();
        cy.get('span').contains('People First').should('exist');
    });

    it('Should create hash', function () {
        jcontent = JContent.visit('digitall', 'en', 'pages/home');
        contentEditor = jcontent.editComponentByText('People First');
        contentEditor.switchToAdvancedMode();
        cy.hash().should('contain', 'contentEditor:');
        cy.hash().should('contain', 'lang:en');
    });
});
