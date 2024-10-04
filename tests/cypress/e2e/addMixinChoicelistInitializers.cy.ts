import {JContent} from '../page-object/jcontent';
import {PageComposer} from '../page-object/pageComposer';

const sitekey = 'contentEditorSiteAddMixin';
describe('Add Mixin by using choice list initializers (Image Reference)', () => {
    let pageComposer: PageComposer;
    const cypressDocumentManagerImageReferenceLinkTest = 'Cypress document manager image reference link Test';
    before(function () {
        cy.executeGroovy('createSiteI18N.groovy', {SITEKEY: sitekey});
        cy.loginEditor(); // Edit in chief
        JContent.visit(sitekey, 'en', 'media/file');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
        cy.get('div[data-cm-role="grid-content-list"]')
            .children('div')
            .selectFile('cypress/fixtures/snowbearHome.jpeg', {
                action: 'drag-drop',
                waitForAnimations: true
            });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
    });

    after(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: sitekey});
    });

    beforeEach(() => {
        cy.loginEditor();
        pageComposer = PageComposer.visit(sitekey, 'en', 'home.html');
    });

    it('Can create a document manager image reference link', () => {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('Document Manager')
            .selectContentType('Document Manager')
            .create();
        cy.get('#contenteditor-dialog-title')
            .should('be.visible')
            .and('contain', 'Create Image (from the Document Manager)');
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click();
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').find('li[role="option"][data-value="internal"]')
            .click();
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]')
            .scrollIntoView();
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]').should('be.visible');

        contentEditor.getLanguageSwitcher().select('Français');

        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]')
            .as('fr_internal_link')
            .scrollIntoView();

        cy.get('@fr_internal_link').should('be.visible');

        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click();

        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').find('li[role="option"][data-value="external"]')
            .click();

        cy.get('@fr_internal_link').should('not.exist');

        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:linkTitle"]')
            .scrollIntoView();

        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:linkTitle"]').should('be.visible');

        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:url"]').scrollIntoView();

        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:url"]').should('be.visible');
        contentEditor.getLanguageSwitcher().select('Deutsch');

        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]').should('not.exist');

        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:linkTitle"]')
            .scrollIntoView();
        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:linkTitle"]').should('be.visible');

        cy.get('[data-sel-content-editor-field="jmix\\:externalLink_j\\:url"]')
            .as('de_external_link_url')
            .scrollIntoView();

        cy.get('@de_external_link_url').should('be.visible');
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click();
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').find('li[role="option"][data-value="none"]')
            .click();
        cy.get('@de_external_link_url').should('not.exist');
        contentEditor.getLanguageSwitcher().select('English');
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').contains('No link');
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click();
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').find('li[role="option"][data-value="internal"]')
            .click();
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]')
            .scrollIntoView();
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]').should('be.visible')
            .click();
        cy.get('.moonstone-loader').should('not.exist'); // Wait to load
        cy.get('.moonstone-tab-item[data-cm-view-type="pages"]')
            .should('be.visible')
            .click();
        cy.get('.moonstone-tab-item[data-cm-view-type="pages"]').should('have.class', 'moonstone-selected');
        cy.get('.moonstone-loader').should('not.exist'); // Wait to load
        cy.get('tr[data-cm-role="table-content-list-row"]').contains('Search Results').click();
        cy.get('button[data-sel-picker-dialog-action="done"]').click();
        cy.get('[data-sel-content-editor-field="mix\\:title_jcr\\:title"]')
            .scrollIntoView();

        cy.get('[data-sel-content-editor-field="mix\\:title_jcr\\:title"]').should('be.visible')
            .type(cypressDocumentManagerImageReferenceLinkTest);
        cy.get('[data-sel-content-editor-field="jnt\\:imageReferenceLink_j\\:node"]')
            .scrollIntoView();
        cy.get('[data-sel-content-editor-field="jnt\\:imageReferenceLink_j\\:node"]').should('be.visible')
            .click();
        cy.get('[data-sel-role-card="snowbearHome.jpeg"]').should('be.visible').contains('snowbearHome.jpeg').click();
        cy.get('button[data-sel-picker-dialog-action="done"]').click();
        contentEditor.create();
        pageComposer
            .refresh()
            .componentShouldBeVisible(
                `a[href*="/sites/${sitekey}/home/search-results.html"] > img[src*="/sites/${sitekey}/files/snowbearHome.jpeg"]`
            );
    });

    it('Can edit a document manager image reference link', () => {
        const contentEditor = pageComposer.editComponent(
            `a[href*="/sites/${sitekey}/home/search-results.html"] > img[src*="/sites/${sitekey}/files/snowbearHome.jpeg"]`
        );
        cy.get('#contenteditor-dialog-title')
            .should('be.visible')
            .and('contain', 'Cypress document manager image reference');
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click();
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').find('li[role="option"][data-value="none"]')
            .click();
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]').should('not.exist');
        contentEditor.getLanguageSwitcher().select('Français');
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').contains('Pas de lien');
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType')
            .click();
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').find('li[role="option"][data-value="internal"]')
            .click();
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]')
            .scrollIntoView();
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]').should('be.visible');
        contentEditor.getLanguageSwitcher().select('English');
        cy.get('#select-jnt\\:imageReferenceLink_j\\:linkType').contains('Internal');
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]')
            .should('exist')
            .scrollIntoView();
        cy.get('[data-sel-content-editor-field="jmix\\:internalLink_j\\:linknode"]').should('be.visible');
        // ContentEditor.cancelAndDiscard()
        contentEditor.cancel();
    });
});
