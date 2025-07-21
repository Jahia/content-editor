import {addNode, createSite, deleteSite, enableModule} from '@jahia/cypress';
import {JContent} from '../page-object';

describe('Test that the json overrides deployed in the test modules are behaving as expected', () => {
    const siteKey = 'jsonOverridesTest';
    const langEN = 'en';
    const langFR = 'fr';
    const langDE = 'de';
    const siteConfig = {
        languages: `${langEN},${langFR},${langDE}`,
        templateSet: 'dx-base-demo-templates',
        serverName: 'localhost',
        locale: langEN
    };
    let jcontent: JContent;

    before(function () {
        createSite(siteKey, siteConfig);
        enableModule('content-editor-test-module', siteKey);
        addNode({
            parentPathOrId: `/sites/${siteKey}/contents`,
            name: 'testProtoMerge',
            primaryNodeType: 'cent:testProtoMerge',
            properties: [{name: 'jcr:title', language: 'en', value: 'testProtoMerge'}]
        });
    });

    after(function () {
        cy.logout();
        deleteSite(siteKey);
    });

    beforeEach(() => {
        cy.loginAndStoreSession();
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    it('Should display the form as defined and ordered in the override for cent:listeZigzag', function () {
        const contentEditor = jcontent.createContent('zigzag');
        cy.get('div[data-sel-content-editor-fields-group="Content"]').as('contentSection').find('article').as('articles').should('have.length', 4);
        cy.get('input[id$="jcr:title"]').should('have.length', 1);
        // Check the custom title label based on resource key: cemix_zoneContenantShortNews.jcr_title
        cy.get('@articles').eq(0).should('contain.text', 'Titre Zone Affichage (*)').find('input[id$="jcr:title"]').should('have.value', 'ZigZag');
        cy.get('@articles').eq(1).should('contain.text', 'ZA de type zigzag');
        cy.get('@articles').eq(2).should('contain.text', 'Création automatique de la pagination');
        const dropdownField = contentEditor.getDropdownField('cemix:autoCreatePager_customPageSize');
        // Definition define a list like 2,3,4,5 we override with only 1,3
        // Note that this is not a valid override as the list is not a subset of the original list. It's just testing to make sure value
        // constraints are being taken into account.
        dropdownField.checkOptions(['1', '3']);
        dropdownField.addNewValue('3');
        dropdownField.checkValue('3');
        cy.get('@articles').eq(3).should('contain.text', 'Test override without resource bundle key');
        const multipleLeftRightField = contentEditor.getMultipleLeftRightField('cemix:zoneContenantShortNews_responsable');
        multipleLeftRightField.get().should('exist').scrollIntoView();
        multipleLeftRightField.checkOptions(['Anime: Albator', 'Anime: Goldorak']);
        multipleLeftRightField.addNewValue('Anime: Albator');
        multipleLeftRightField.checkValues(['Anime: Albator']);
        contentEditor.cancelAndDiscard();
    });

    it('can filter out proto fields in json overrides', () => {
        const ce = jcontent.editComponentByText('testProtoMerge');
        ce.getTitle().should('be.visible').and('contain', 'testProtoMerge');

        cy.log('Test proto field does not pollute js objects');
        cy.window().then(win => {
            const result = win.eval('({}).polluted');
            // eslint-disable-next-line no-unused-expressions
            expect(result).to.be.undefined;
        });
    });
});
