import gql from 'graphql-tag';
import {BaseComponent, getComponentByRole} from '@jahia/cypress';

describe('Category tests', () => {
    const getNodeId = gql`
        query getNodeId($path: String!) {
            jcr {
                nodeByPath(path: $path) {
                    uuid
                }
            }
        }`;

    beforeEach(() => {
        cy.login(); // Edit in chief
        const path = '/sites/systemsite/categories/annual-filings';
        cy.apollo({query: getNodeId, variables: {path}})
            .its('data.jcr.nodeByPath.uuid').as('nodeId')
            .should('not.be.empty', '@nodeId');
        cy.get('@nodeId').then(nodeId => cy.visit(`/jahia/content-editor/en/edit/${nodeId}`));
    });

    it('Category only displays Content section in edit', () => {
        const sectionAttr = 'data-sel-content-editor-fields-group';
        cy.get(`[${sectionAttr}]`)
            .should('have.length', 1)
            .and('have.attr', sectionAttr, 'Content');
    });

    it('Displays limited advanced options', () => {
        getComponentByRole(BaseComponent, 'tab-advanced-options')
            .get().click()
            .should('have.class', 'moonstone-selected');

        const advOptions = ['Technical information', 'Live roles', 'Edit roles', 'Usages', 'History'];
        cy.get('[data-sel-role="advanced-options-nav"] li')
            .should('have.length', advOptions.length)
            .and(elems => {
                advOptions.forEach(opt => expect(elems).to.contain(opt));
            });
    });
});
