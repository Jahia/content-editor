import {DocumentNode} from 'graphql';
import {PageComposer} from '../page-object/pageComposer';
import {Picker} from '../page-object/picker';
import {Collapsible, getComponentByRole, getComponentBySelector} from '@jahia/cypress';
import {ContentEditor} from '../page-object';

interface FillContentType {
    contentEditor: ContentEditor,
    contentSection: Collapsible,
    lang: string,
    title: string,
    description:string,
    image: string,
    modify?: boolean
}

interface Subject {
    title: string,
    description: string,
    image: string,
    lang: string,
    locale: string,
    editPresent?: boolean,
    livePresent?: boolean
}
interface TestNewsType {
    pageComposer: PageComposer,
    subjects: Array<Subject>
}

const sitekey = 'contentMultiLanguage';

describe('Create multi language content and verify that it is different in all languages', () => {
    let pageComposer: PageComposer;
    let setProperty: DocumentNode;

    before(function () {
        setProperty = require('graphql-tag/loader!../fixtures/contentMultiLanguage/setPropertyValue.graphql');
    });

    afterEach(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: sitekey});
    });

    beforeEach(() => {
        cy.executeGroovy('contentMultiLanguage/contentMultiLanguageSite.groovy', {SITEKEY: sitekey}).then(() => {
            cy.apollo({
                mutation: setProperty,
                variables: {
                    prop: 'jcr:title',
                    lang: 'de',
                    value: 'Home',
                    path: `/sites/${sitekey}/home`
                }
            }).then(response => {
                expect(response.data.jcr.mutateNode.mutateProperty.setValue).to.be.true;
            });

            cy.apollo({
                mutation: setProperty,
                variables: {
                    prop: 'jcr:title',
                    lang: 'fr',
                    value: 'Home',
                    path: `/sites/${sitekey}/home`
                }
            }).then(response => {
                expect(response.data.jcr.mutateNode.mutateProperty.setValue).to.be.true;
            });

            cy.loginEditor();
            pageComposer = PageComposer.visit(sitekey, 'en', 'home.html');
        });
    });

    const newsByLanguage = {
        en: {
            title: 'English news',
            description: 'Something new happened in England',
            image: 'cypress/fixtures/contentMultiLanguage/snowBear.jpeg',
            lang: 'English',
            locale: 'en'
        },
        de: {
            title: 'German news',
            description: 'Something new happened in Germany',
            image: 'cypress/fixtures/contentMultiLanguage/snowCat.jpeg',
            lang: 'Deutsch',
            locale: 'de'
        },
        fr: {
            title: 'French news',
            description: 'Something new happened in France',
            image: 'cypress/fixtures/contentMultiLanguage/snowWolf.jpeg',
            lang: 'Français',
            locale: 'fr'
        }
    };

    const fillNews = (data: FillContentType) => {
        // Fill title and description
        data.contentEditor.getLanguageSwitcher().select(data.lang);
        data.contentSection.collapse();
        data.contentSection.expand();
        data.contentSection.get().find('input[id="jnt:news_jcr:title"]').should('be.visible').type(data.title);
        data.contentSection.get().find('.cke_button__source.cke_button_off').should('be.visible').click();
        data.contentSection.get().find('textarea').should('be.visible').type(data.description);

        // Toggle should be ON if modifying
        if (data.modify) {
            data.contentSection.get().find('[data-sel-content-editor-multiple-generic-field="jdmix:imgGallery_galleryImg[0]"]').find('button[aria-label="Clear"]').click();
        }

        // This condition is here because once jdmix:imgGallery toggle is ON it stays on for next languages
        if (data.lang !== 'English' || data.modify) {
            data.contentSection.get().find('[data-sel-action="addField"]').click();
        } else {
            data.contentSection.get().find('input[id="jdmix:imgGallery"]').click();
            data.contentSection.get().find('[data-sel-action="addField"]').click();
        }

        const picker = getComponentByRole(Picker, 'picker-dialog');
        picker.switchViewMode('List');

        // Image should exist in the table if modifying
        if (data.modify) {
            picker.getTableRow(data.image.split('/')[3]).find('input').click();
        } else {
            picker.uploadFile(data.image);
        }

        picker.wait(1000);
        picker.select();
        picker.wait(1000);
    };

    const testNewsCreation = (data: TestNewsType) => {
        data.subjects.forEach(s => {
            data.pageComposer.switchLanguage(s.lang);
            pageComposer.navigateToPage('Home');
            // Will be skipped in  editPresent undefined
            if (s.editPresent !== undefined && s.editPresent) {
                pageComposer.shouldContain(s.title);
                pageComposer.doInsideInnerFrame(() => {
                    cy.get('a').contains('Read More').click();
                });

                pageComposer.doInsideInnerFrame(() => {
                    cy.get('h2').contains(s.title);
                    cy.get('p').contains(s.description);
                });
            }

            // Will be skipped in  livePresent undefined
            if (s.livePresent !== undefined && s.livePresent) {
                PageComposer.visitLive(sitekey, s.locale, 'home.html');
                cy.contains(s.title);
                cy.get('a').contains('Read More').click();
                cy.get('.news-v3').find(`img[src="/files/live/sites/${sitekey}/files/${s.image.split('/')[3]}"]`).should('exist');
                PageComposer.visit(sitekey, s.locale, 'home.html');
            } else if (s.livePresent !== undefined && !s.livePresent) {
                PageComposer.visitLive(sitekey, s.locale, 'home.html');
                cy.contains(s.title).should('not.exist');
                PageComposer.visit(sitekey, s.locale, 'home.html');
            }
        });
    };

    it('Can create content in 3 languages and publish respecting mandatory language rules', {retries: 0}, function () {
        // Publish in all languages first to make site available in live
        pageComposer.publish('Publish Home in all languages', 'Publish all now');
        // There is gwt snackbar but it's quite tricky to catch so I'm using this temporarily
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000);
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('News entry')
            .selectContentType('News entry')
            .create();

        // Create news entry in 3 languages
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create News entry');
        const contentSection = contentEditor.openSection('Content');
        contentSection.expand();

        Object.keys(newsByLanguage).sort(a => a === 'English' ? 1 : 0).forEach(key => {
            fillNews({contentEditor, contentSection, ...newsByLanguage[key]});
        });

        contentEditor.save();
        pageComposer.refresh();

        // Verify news entries were created in 3 languages
        const subjects = <Subject[]>Object.keys(newsByLanguage).sort(a => a === 'English' ? 1 : 0).map(s => ({...newsByLanguage[s], editPresent: true}));
        testNewsCreation({pageComposer, subjects});

        // Test publication
        // Should be absent in live because 2nd mandatory language was not published
        pageComposer.switchLanguage(newsByLanguage.en.lang);
        pageComposer.navigateToPage('Home');
        pageComposer.publish('Publish Home - English', 'Publish now');
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000);
        testNewsCreation({pageComposer, subjects: [{...newsByLanguage.en, livePresent: false}]});

        // Publish 2nd mandatory language and check for presence in live
        pageComposer.switchLanguage(newsByLanguage.fr.lang);
        pageComposer.navigateToPage('Home');
        pageComposer.publish('Publish Home - Français', 'Publish now');
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000);
        testNewsCreation({pageComposer, subjects: [{...newsByLanguage.en, livePresent: true}, {...newsByLanguage.fr, livePresent: true}, {...newsByLanguage.de, livePresent: false}]});

        // Publish in German and everything should be available
        pageComposer.switchLanguage(newsByLanguage.de.lang);
        pageComposer.navigateToPage('Home');
        pageComposer.publish('Publish Home - Deutsch', 'Publish now');
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000);
        testNewsCreation({pageComposer, subjects: [{...newsByLanguage.en, livePresent: true}, {...newsByLanguage.fr, livePresent: true}, {...newsByLanguage.de, livePresent: true}]});
    });

    it('Can create and modify content in 2 languages and publish respecting mandatory language rules', {retries: 0}, function () {
        const reducedNewsByLanguage = newsByLanguage;
        delete reducedNewsByLanguage.de;
        // Publish in all languages first to make site available in live
        pageComposer.publish('Publish Home in all languages', 'Publish all now');
        // There is gwt snackbar but it's quite tricky to catch so I'm using this temporarily
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000);
        let contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('News entry')
            .selectContentType('News entry')
            .create();

        // Create news entry in 3 languages
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create News entry');
        let contentSection = contentEditor.openSection('Content');
        contentSection.expand();

        Object.keys(reducedNewsByLanguage).sort(a => a === 'English' ? 1 : 0).forEach(key => {
            fillNews({contentEditor, contentSection, ...reducedNewsByLanguage[key]});
        });

        contentEditor.save();
        pageComposer.refresh();

        // Test publication
        // Should be absent in live because 2nd mandatory language was not published
        pageComposer.switchLanguage(reducedNewsByLanguage.en.lang);
        pageComposer.navigateToPage('Home');
        pageComposer.publish('Publish Home - English', 'Publish now');
        pageComposer.switchLanguage(reducedNewsByLanguage.fr.lang);
        pageComposer.navigateToPage('Home');
        pageComposer.publish('Publish Home - Français', 'Publish now');
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000);
        testNewsCreation({pageComposer, subjects: [{...reducedNewsByLanguage.en, livePresent: true}, {...reducedNewsByLanguage.fr, livePresent: true}]});

        // Modify news

        pageComposer.editComponent('.news-v3-in-sm');
        cy.get('#contenteditor-dialog-title').should('be.visible');
        contentSection = contentEditor.openSection('Content');
        contentSection.expand();

        reducedNewsByLanguage.en.title += ' modified';
        reducedNewsByLanguage.fr.title += ' modified';
        reducedNewsByLanguage.en.description += ' modified';
        reducedNewsByLanguage.fr.description += ' modified';
        const image = reducedNewsByLanguage.en.image;
        reducedNewsByLanguage.en.image = reducedNewsByLanguage.fr.image;
        reducedNewsByLanguage.en.image = image;

        Object.keys(reducedNewsByLanguage).forEach(key => {
            fillNews({contentEditor, contentSection, ...reducedNewsByLanguage[key], modify: true});
        });

        contentEditor.save();
        pageComposer.refresh();

        // Test publication
        // Should be present in live in modified form
        pageComposer.switchLanguage(reducedNewsByLanguage.en.lang);
        pageComposer.navigateToPage('Home');
        pageComposer.publish('Publish Home - English', 'Publish now');
        pageComposer.switchLanguage(reducedNewsByLanguage.fr.lang);
        pageComposer.navigateToPage('Home');
        pageComposer.publish('Publish Home - Français', 'Publish now');
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000);
        testNewsCreation({pageComposer, subjects: [{...reducedNewsByLanguage.en, livePresent: true}, {...reducedNewsByLanguage.fr, livePresent: true}]});
    });
});
