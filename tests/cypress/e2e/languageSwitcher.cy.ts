import {JContent} from '../page-object/jcontent';
import gql from 'graphql-tag';

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
        ce.openSection('Content').get().find('input[type="text"]').clear().type('cypress-test');

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
});
