import {DocumentNode} from 'graphql';
import {PageComposer} from '../page-object/pageComposer';
import {Picker} from '../page-object/picker';
import {Collapsible, getComponentByRole} from '@jahia/cypress';
import {ContentEditor} from '../page-object';
import gql from 'graphql-tag';

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
    subject: Subject
}

const sitekey = 'contentMultiLanguage';
const publishedNewsPath = `/sites/${sitekey}/home/area-main/english-news`;
const homePath = `/sites/${sitekey}/home`;

describe('Create multi language content and verify that it is different in all languages', () => {
    let pageComposer: PageComposer;
    let setProperty: DocumentNode;

    const publishMutation = gql`mutation publish($path:String!, $languages:[String!]) {
      jcr(workspace:EDIT) {
        mutateNode(pathOrId:$path) {
          publish(languages:$languages)
        }
      }
    }`;

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
                // eslint-disable-next-line
                expect(response?.data?.jcr?.mutateNode?.mutateProperty?.setValue).to.be.true;
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
                // eslint-disable-next-line
                expect(response?.data?.jcr?.mutateNode?.mutateProperty?.setValue).to.be.true;
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

        // Clear fields on modification
        if (data.modify) {
            data.contentSection.get().find('.cke_button__source.cke_button_off').scrollIntoView().click();
            data.contentSection.get().find('textarea').scrollIntoView().should('be.visible').clear().type(data.description);
        } else {
            data.contentSection.get().find('input[id="jnt:news_jcr:title"]').should('be.visible').type(data.title);
            data.contentSection.get().find('.cke_button__source.cke_button_off').should('be.visible').click();
            data.contentSection.get().find('textarea').should('be.visible').type(data.description);
        }

        // Toggle should be ON if modifying
        if (data.modify) {
            data.contentSection.get().find('[data-sel-content-editor-multiple-generic-field="jdmix:imgGallery_galleryImg[0]"]').find('button[aria-label="Clear"]').scrollIntoView().click();
        }

        // This condition is here because once jdmix:imgGallery toggle is ON it stays on for next languages
        if (data.lang !== 'English' || data.modify) {
            data.contentSection.get().find('[data-sel-action="addField"]').scrollIntoView().click();
        } else {
            data.contentSection.get().find('input[id="jdmix:imgGallery"]').scrollIntoView().click();
            data.contentSection.get().find('[data-sel-action="addField"]').scrollIntoView().click();
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
        const s = data.subject;
        data.pageComposer.switchLanguage(s.lang);
        pageComposer.navigateToPage('Home');
        // Will be skipped in  editPresent undefined
        if (s.editPresent !== undefined && s.editPresent) {
            pageComposer.shouldContain(s.title);
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
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
    };

    it('Can create content in 3 languages and publish respecting mandatory language rules', {retries: 0}, function () {
        // Publish in all languages first to make site available in live
        let pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['en', 'fr', 'de']
        }});
        pageComposer.publishedAfter(`/sites/${sitekey}/home`, 'en', pubDate);
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

        fillNews({contentEditor, contentSection, ...newsByLanguage.en});
        fillNews({contentEditor, contentSection, ...newsByLanguage.de});
        fillNews({contentEditor, contentSection, ...newsByLanguage.fr});

        contentEditor.create();
        pageComposer.refresh();

        // Verify news entries were created in 3 languages
        const subjects = <Subject[]>Object.keys(newsByLanguage).sort(a => a === 'English' ? 1 : 0).map(s => ({...newsByLanguage[s], editPresent: true}));
        testNewsCreation({pageComposer, subject: subjects[0]});
        testNewsCreation({pageComposer, subject: subjects[1]});
        testNewsCreation({pageComposer, subject: subjects[2]});

        // Test publication
        // Should be absent in live because 2nd mandatory language was not published
        pageComposer.switchLanguage(newsByLanguage.en.lang);
        pageComposer.navigateToPage('Home');
        pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['en']
        }});
        pageComposer.publishedAfter(publishedNewsPath, 'en', pubDate);
        testNewsCreation({pageComposer, subject: {...newsByLanguage.en, livePresent: false}});

        // Publish 2nd mandatory language and check for presence in live
        pageComposer.switchLanguage(newsByLanguage.fr.lang);
        pageComposer.navigateToPage('Home');
        pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['fr']
        }});
        pageComposer.publishedAfter(publishedNewsPath, 'fr', pubDate);
        testNewsCreation({pageComposer, subject: {...newsByLanguage.en, livePresent: true}});
        testNewsCreation({pageComposer, subject: {...newsByLanguage.fr, livePresent: true}});
        testNewsCreation({pageComposer, subject: {...newsByLanguage.de, livePresent: false}});

        // Publish in German and everything should be available
        pageComposer.switchLanguage(newsByLanguage.de.lang);
        pageComposer.navigateToPage('Home');
        pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['de']
        }});
        pageComposer.publishedAfter(publishedNewsPath, 'de', pubDate);
        testNewsCreation({pageComposer, subject: {...newsByLanguage.en, livePresent: true}});
        testNewsCreation({pageComposer, subject: {...newsByLanguage.fr, livePresent: true}});
        testNewsCreation({pageComposer, subject: {...newsByLanguage.de, livePresent: true}});
    });

    it('Can create and modify content in 2 languages and publish respecting mandatory language rules', {retries: 0}, function () {
        const reducedNewsByLanguage = {...newsByLanguage};
        delete reducedNewsByLanguage.de;
        // Publish in all languages first to make site available in live
        let pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['en', 'fr', 'de']
        }});
        pageComposer.publishedAfter(`/sites/${sitekey}/home`, 'en', pubDate);
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('News entry')
            .selectContentType('News entry')
            .create();

        // Create news entry in 2 mandatory languages
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create News entry');
        let contentSection = contentEditor.openSection('Content');
        contentSection.expand();

        fillNews({contentEditor, contentSection, ...reducedNewsByLanguage.en});
        fillNews({contentEditor, contentSection, ...reducedNewsByLanguage.fr});

        contentEditor.create();
        pageComposer.refresh();

        // Test publication
        // Publish news in both languages and test for presence in live
        pageComposer.switchLanguage(reducedNewsByLanguage.en.lang);
        pageComposer.navigateToPage('Home');
        pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['en']
        }});
        pageComposer.publishedAfter(publishedNewsPath, 'en', pubDate);

        pageComposer.switchLanguage(reducedNewsByLanguage.fr.lang);
        PageComposer.visit(sitekey, 'fr', 'home.html');
        pageComposer.navigateToPage('Home');
        pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['fr']
        }});
        pageComposer.publishedAfter(publishedNewsPath, 'fr', pubDate);
        testNewsCreation({pageComposer, subject: {...reducedNewsByLanguage.en, livePresent: true}});
        testNewsCreation({pageComposer, subject: {...reducedNewsByLanguage.fr, livePresent: true}});

        // Modify news
        pageComposer.editComponent('.news-v3-in-sm');
        cy.get('#contenteditor-dialog-title').should('be.visible');
        contentSection = contentEditor.openSection('Content');
        contentSection.expand();

        reducedNewsByLanguage.en.description += ' modified';
        reducedNewsByLanguage.fr.description += ' modified';
        const image = reducedNewsByLanguage.en.image;
        reducedNewsByLanguage.en.image = reducedNewsByLanguage.fr.image;
        reducedNewsByLanguage.en.image = image;

        fillNews({contentEditor, contentSection, ...reducedNewsByLanguage.en, modify: true});
        fillNews({contentEditor, contentSection, ...reducedNewsByLanguage.fr, modify: true});

        contentEditor.save();
        pageComposer.refresh();

        // Test publication
        // Should be present in live in modified form
        pageComposer.switchLanguage(reducedNewsByLanguage.en.lang);
        pageComposer.navigateToPage('Home');
        pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['en']
        }});
        pageComposer.publishedAfter(publishedNewsPath, 'en', pubDate);

        pageComposer.switchLanguage(reducedNewsByLanguage.fr.lang);
        PageComposer.visit(sitekey, 'fr', 'home.html');
        pageComposer.navigateToPage('Home');
        pubDate = new Date();
        cy.apollo({mutation: publishMutation, variables: {
            path: homePath,
            languages: ['fr']
        }});
        pageComposer.publishedAfter(publishedNewsPath, 'fr', pubDate);
        testNewsCreation({pageComposer, subject: {...reducedNewsByLanguage.en, livePresent: true}});
        testNewsCreation({pageComposer, subject: {...reducedNewsByLanguage.fr, livePresent: true}});
    });
});
