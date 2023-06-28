import {JContent} from '../page-object/jcontent';
import {ContentEditor} from '../page-object';
import {PageComposer} from '../page-object/pageComposer';
import {Button, getComponentByRole} from '@jahia/cypress';
import gql from 'graphql-tag';

describe('Editor url test', () => {
    let jcontent: JContent;
    let contentEditor: ContentEditor;
    let peopleFirstUrl;
    let validUuid;

    it('should open editor', function () {
        cy.login();
        jcontent = JContent.visit('digitall', 'en', 'pages/home');
        contentEditor = jcontent.editComponentByText('People First');
        contentEditor.switchToAdvancedMode();
        cy.url().then(url => {
            peopleFirstUrl = url;
            cy.logout();
        });
        getValidUuid();
    });

    beforeEach(() => {
        cy.loginEditor();
    });

    after(() => {
        cy.logout();
    });

    function getValidUuid() {
        cy.apollo({
            mutation: gql`
                query getUuid {
                    jcr {
                        nodeByPath(path: "/sites/digitall/home/about/area-main/rich-text") { uuid }
                    }
                }
            `
        }).then(resp => {
            validUuid = resp?.data?.jcr?.nodeByPath?.uuid;
        });
    }

    it('Should open editor upon login', function () {
        cy.visit(this.peopleFirstUrl, {failOnStatusCode: false});
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

    it('Should show error modal for opening CE url for invalid UUID', () => {
        const uuid = 'invalidUuid';
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        const ceParams = `(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:en,mode:edit,site:digitall,uilang:en,uuid:${uuid})))`;
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('[data-sel-role="ce-error-dialog"]')
            .should('be.visible')
            .and('contain', 'Content Editor could not be opened');
        getComponentByRole(Button, 'close-button').click();
        cy.get('.moonstone-header h1').contains('About').should('be.visible');
    });

    it('should break all inheritance for node', () => {
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        const ceParams = `(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:en,mode:edit,site:digitall,uilang:en,uuid:${validUuid})))`;
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('[data-sel-role="tab-advanced-options"]')
            .click()
            .should('have.class', 'moonstone-selected');
        cy.get('[data-sel-role="advanced-options-nav"] li')
            .contains('Edit roles')
            .click();
        cy.get('#JahiaGxtEditEngineTabs button').contains('Break all inheritance').click();
        cy.get('button.x-btn-text').contains('Save').click();
    });

    it('Should show error modal for opening CE url for user with no permission', () => {
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        const ceParams = `(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:en,mode:edit,site:digitall,uilang:en,uuid:${validUuid})))`;
        cy.logout();
        cy.login('irina', 'password');
        JContent.visit('digitall', 'en', 'pages/home');
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('[data-sel-role="ce-error-dialog"]')
            .should('be.visible')
            .and('contain', 'Content Editor could not be opened');
        getComponentByRole(Button, 'close-button').click();
        cy.get('.moonstone-header h1').contains('About').should('be.visible');
    });

    it('Should restore all inheritance for node', () => {
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        const ceParams = `(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:en,mode:edit,site:digitall,uilang:en,uuid:${validUuid})))`;
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('[data-sel-role="tab-advanced-options"]')
            .click()
            .should('have.class', 'moonstone-selected');
        cy.get('[data-sel-role="advanced-options-nav"] li')
            .contains('Edit roles')
            .click();
        cy.get('#JahiaGxtEditEngineTabs button').contains('Restore all inheritance').click();
        cy.get('button.x-btn-text').contains('Save').click();
    });

    it('Should show error modal for opening CE url for missing/invalid params', () => {
        const uuid = 'invalidUuid';
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        // Missing end parens
        const ceParams = `(contentEditor:!((formKey:modal_0,lang:en,mode:edit,site:digitall,uilang:en,uuid:${validUuid})`;
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('[data-sel-role="ce-error-dialog"]')
            .should('be.visible')
            .and('contain', 'Content Editor could not be opened');
        getComponentByRole(Button, 'close-button').click();
        cy.get('.moonstone-header h1').contains('About').should('be.visible');
    });
});
