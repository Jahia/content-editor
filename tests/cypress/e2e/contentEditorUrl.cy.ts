import {JContent} from '../page-object/jcontent';
import {SmallTextField} from '../page-object/fields';
import {Button, getComponentByRole} from '@jahia/cypress';
import gql from "graphql-tag";

describe('Content editor URLs', () => {
    let jcontent: JContent;
    let validUuid = '';

    before(() => {
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
        })
    });

    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        cy.loginEditor();
        jcontent = JContent.visit('contentEditorSite', 'en', 'pages/home');
    });

    it('Should show full screen', () => {
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        const ceParams = `(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:en,mode:edit,site:digitall,uilang:en,uuid:${validUuid})))`
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('.moonstone-header h1').contains('Digitall is a global network').should('be.visible');
    });

    it('Should show error modal for opening CE url for invalid UUID', () => {
        const uuid = 'invalidUuid';
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        const ceParams = `(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:en,mode:edit,site:digitall,uilang:en,uuid:${uuid})))`
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('[data-sel-role="ce-error-dialog"]')
            .should('be.visible')
            .and('contain', 'Content Editor could not be opened');
        getComponentByRole(Button, 'close-button').click();
        cy.get('.moonstone-header h1').contains('About').should('be.visible');
    });

    it('Should show error modal for opening CE url for invalid UUID', () => {
        const uuid = 'invalidUuid';
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        const ceParams = `(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:en,mode:edit,site:digitall,uilang:en,uuid:${uuid})))`
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('[data-sel-role="ce-error-dialog"]')
            .should('be.visible')
            .and('contain', 'Content Editor could not be opened');
        getComponentByRole(Button, 'close-button').click();
        cy.get('.moonstone-header h1').contains('About').should('be.visible');
    });

    it('Should show error modal for opening CE url for missing params', () => {
        const uuid = 'invalidUuid';
        const baseUrl = '/jahia/jcontent/digitall/en/pages/home/about';
        const ceParams = `(contentEditor:!((formKey:modal_0,lang:en,mode:edit,site:digitall,uilang:en,uuid:${validUuid})))`
        cy.visit(`${baseUrl}#${ceParams}`);
        cy.get('[data-sel-role="ce-error-dialog"]')
            .should('be.visible')
            .and('contain', 'Content Editor could not be opened');
        getComponentByRole(Button, 'close-button').click();
        cy.get('.moonstone-header h1').contains('About').should('be.visible');
    });

});
