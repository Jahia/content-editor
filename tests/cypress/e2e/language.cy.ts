import {JContent} from '../page-object/jcontent';
import gql from 'graphql-tag';
import {ContentEditor} from '../page-object';

describe('Language switcher tests', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;
    const createText = gql`
        mutation createText {
            jcr {
                mutateNode(pathOrId: "/sites/digitall/contents") {
                    addChild(name: "lang-switcher-test", primaryNodeType: "jnt:contentFolder") {
                        addChild(
                            name: "lang-switcher-text", 
                            primaryNodeType: "jnt:text", 
                            properties: [{ name: "text", language: "fr", value: "bonjour" }]
                        ) {
                            uuid
                        }
                    }
                }
            }
        }
    `;

    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login(); // Edit in chief

        // BeforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    function langInGroup(elems, lang, dropdownGroup) {
        const groupText = elems.find(`:contains("${lang}")`)
            .parents('[data-option-type="group"]')
            .find('.moonstone-title')
            .text();
        expect(groupText).to.equals(dropdownGroup);
    }

    it('Create content - should have all language options in "Create translation" group', () => {
        const ce = jcontent.createContent('Simple text');
        cy.get('#contenteditor-dialog-title')
            .should('be.visible')
            .and('contain', 'Create Simple text');

        ce.getLanguageSwitcher().get().click()
            .get('li.moonstone-menuItem[role="option"]')
            .should(elems => {
                expect(elems).to.have.length(3);
                langInGroup(elems, 'English', 'Create translation');
                langInGroup(elems, 'Deutsch', 'Create translation');
                langInGroup(elems, 'Français', 'Create translation');
            });
    });

    it('Create content - should have edited language in "View language" group after edit', () => {
        const ce = jcontent.createContent('Simple text');
        cy.get('#contenteditor-dialog-title')
            .should('be.visible')
            .and('contain', 'Create Simple text');

        // Verify English is selected by default
        ce.getLanguageSwitcher().get().find('span[title="English"]').should('be.visible');

        // Type text
        ce.getSmallTextField('jnt:text_text').addNewValue('cypress-test');

        // Switch language
        ce.getLanguageSwitcher().select('Deutsch');

        // Verify language switcher
        const langSwitcher = ce.getLanguageSwitcher();
        langSwitcher.get().click()
            .get('li.moonstone-menuItem[role="option"]')
            .should(elems => {
                expect(elems).to.have.length(3);
                langInGroup(elems, 'English', 'Switch language');
                langInGroup(elems, 'Deutsch', 'Create translation');
                langInGroup(elems, 'Français', 'Create translation');
            });
    });

    it('Edit content - Should have edited language in "View language" group', () => {
        cy.apollo({mutation: createText});
        const ce = JContent.visit(siteKey, 'en', 'content-folders/contents/lang-switcher-test')
            .editComponentByText('lang-switcher-text');

        // Verify language switcher
        const langSwitcher = ce.getLanguageSwitcher();
        langSwitcher.get().click()
            .get('li.moonstone-menuItem[role="option"]')
            .should(elems => {
                expect(elems).to.have.length(3);
                langInGroup(elems, 'English', 'Add translation');
                langInGroup(elems, 'Deutsch', 'Add translation');
                langInGroup(elems, 'Français', 'Switch language');
            });

        cy.apollo({mutation: gql`
                mutation deleteContent {
                    jcr { deleteNode(pathOrId: "/sites/digitall/contents/lang-switcher-test") }
                }
            `});
    });

    it('Create content - saves multiple languages', () => {
        const contentName = 'langSwitcherMultipleLang';
        const ce: ContentEditor = jcontent.createContent('Simple text');
        cy.get('#contenteditor-dialog-title')
            .should('be.visible')
            .and('contain', 'Create Simple text');

        cy.log('Fill text in english');
        const enText = 'Cypress test - English';
        ce.getLanguageSwitcher().get().find('span[title="English"]')
            .should('be.visible')
            .log('Language set to English');
        ce.getSmallTextField('jnt:text_text').addNewValue(enText);

        cy.log('Fill text in French');
        const frText = 'Cypress test - French';
        ce.getLanguageSwitcher().select('Français').get().find('span[title="Français"]')
            .should('be.visible')
            .log('Language set to French');
        ce.getSmallTextField('jnt:text_text').addNewValue(frText);

        ce.openSection('Options');
        ce.getSmallTextField('nt:base_ce:systemName', false)
            .addNewValue(contentName);
        ce.save();

        cy.log('Verify text has been created in jcr');
        const query = gql`
            query($path: String!) {
                jcr {
                    nodeByPath(path: $path) {
                        en: property(name:"text", language:"en") { value }
                        fr: property(name:"text", language:"fr") { value }
                    }
                }
            }`;
        const path = `/sites/${siteKey}/contents/${contentName}`;
        cy.apollo({query, variables: {path}}).should(result => {
            expect(result?.data?.jcr?.nodeByPath?.en?.value).equals(enText);
            expect(result?.data?.jcr?.nodeByPath?.fr?.value).equals(frText);
        });

        cy.log('Cleanup');
        cy.apollo({
            mutation: gql`mutation($path: String!) {
                jcr { deleteNode(pathOrId: $path) }
            }`,
            variables: {path}
        });
    });
});
