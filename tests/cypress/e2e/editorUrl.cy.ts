import {JContent} from '../page-object/jcontent';
import {ContentEditor} from '../page-object';

describe('Editor url test', () => {
    let jcontent: JContent;
    let contentEditor: ContentEditor;
    let peopleFirstUrl;

    before(() => {
        cy.loginEditor();
        jcontent = JContent.visit('digitall', 'en', 'pages/home');
        contentEditor = jcontent.editComponentByText('People First');
        contentEditor.switchToAdvancedMode();
        cy.url().then(url => {
            peopleFirstUrl = url;
            cy.logout();
        });
    });

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

    it('History is handled consistently', function () {
        jcontent = JContent.visit('digitall', 'en', 'pages/home');
        contentEditor = jcontent.editComponentByText('People First');
        contentEditor.switchToAdvancedMode();
        cy.get('h1').contains('People First').should('exist');
        cy.go('back');
        cy.get('h1').contains('People First').should('not.exist');
        cy.go('forward');
        cy.get('h1').contains('People First').should('exist');
        contentEditor.cancel();
        cy.go('forward');
        cy.get('h1').contains('People First').should('exist');
        contentEditor.cancel();

        contentEditor = jcontent.editComponentByText('Our Companies');
        contentEditor.switchToAdvancedMode();
        cy.get('h1').contains('Our Companies').should('exist');
        cy.go('back');
        cy.get('h1').contains('Our Companies').should('not.exist');
        cy.go('forward');
        cy.get('h1').contains('Our Companies').should('exist');
        contentEditor.cancel();
        cy.go('forward');
        cy.get('h1').contains('Our Companies').should('exist');
        contentEditor.cancel();
    });
});
