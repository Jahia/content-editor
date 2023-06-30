import {JContent} from '../page-object/jcontent';
import {ContentEditor} from '../page-object';
import {PageComposer} from '../page-object/pageComposer';

describe('Editor url test', () => {
    let jcontent: JContent;
    let contentEditor: ContentEditor;

    it('should open editor', function () {
        cy.login();
        jcontent = JContent.visit('digitall', 'en', 'pages/home');
        contentEditor = jcontent.editComponentByText('People First');
        contentEditor.switchToAdvancedMode();
        cy.url().as('peopleFirstUrl');
    });

    it('Should open editor upon login', function () {
        cy.visit(this.peopleFirstUrl);
        cy.get('input[name="username"]').type('root', {force: true});
        cy.get('input[name="password"]').type('root1234', {force: true});
        cy.get('button[type="submit"]').click({force: true});
        cy.get('h1').contains('People First').should('exist');
        contentEditor = ContentEditor.getContentEditor();
        contentEditor.cancel();
        cy.get('span').contains('People First').should('exist');
    });

    it('Should open editor already logged in', function () {
        cy.login();
        cy.visit(this.peopleFirstUrl);
        cy.get('h1').contains('People First').should('exist');
        contentEditor = ContentEditor.getContentEditor();
        contentEditor.cancel();
        cy.get('span').contains('People First').should('exist');
    });

    it('Should create hash', function () {
        cy.login();
        jcontent = JContent.visit('digitall', 'en', 'pages/home');
        contentEditor = jcontent.editComponentByText('People First');
        contentEditor.switchToAdvancedMode();
        cy.hash().should('contain', 'contentEditor:');
        cy.hash().should('contain', 'lang:en');
    });

    it('History is handled consistently', function () {
        cy.login();
        jcontent = JContent.visit('digitall', 'en', 'pages/home');
        contentEditor = jcontent.editComponentByText('People First');
        contentEditor.switchToAdvancedMode();
        cy.get('h1').contains('People First').should('exist');
        cy.go('back');
        cy.get('h1').contains('People First').should('not.exist');
        cy.go('forward');
        cy.get('h1').contains('People First').should('exist');
        contentEditor.cancel();
        // Wait for transition
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
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
        // Wait for transition
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.go('forward');
        cy.get('h1').contains('Our Companies').should('exist');
        contentEditor.cancel();
    });

    it('Handles breadcrum in GWT correctly', function () {
        cy.login();
        const hashIndex = this.peopleFirstUrl.indexOf('#');
        const hash = this.peopleFirstUrl.substring(hashIndex);
        PageComposer.visit('digitall', 'en', `home.html?redirect=false${hash}`);
        contentEditor.getBreadcrumb('highlights').click();
        cy.get('h1').contains('highlights').should('exist');
    });
});
