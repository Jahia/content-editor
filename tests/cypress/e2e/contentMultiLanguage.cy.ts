import {PageComposer} from '../page-object/pageComposer';
import {PickerGrid} from '../page-object/pickerGrid';
import {Collapsible, getComponentByRole} from '@jahia/cypress';
import {ContentEditor} from '../page-object';

interface FillContentType {
    contentEditor: ContentEditor,
    contentSection: Collapsible,
    lang: string,
    title: string,
    description:string,
    image: string
}

const sitekey = 'contentMultiLanguage';

describe('Create multi language content and verify that it is different in all languages', () => {
    let pageComposer: PageComposer;

    before(function () {
        cy.executeGroovy('contentMultiLanguageSite.groovy', {SITEKEY: sitekey});
    });

    after(function () {
        cy.logout();
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: sitekey});
    });

    beforeEach(() => {
        cy.loginEditor();
        pageComposer = PageComposer.visit(sitekey, 'en', 'home.html');
    });

    const newsByLanguage = {
        'en': {
            title: 'English news',
            description: 'Something new happened in England',
            image: 'cypress/fixtures/snowbearHome.jpeg',
            lang: 'English'
        },
        'de': {
            title: 'German news',
            description: 'Something new happened in Germany',
            image: 'cypress/fixtures/snowCat.jpeg',
            lang: 'Deutsch'
        },
        'fr': {
            title: 'French news',
            description: 'Something new happened in France',
            image: 'cypress/fixtures/snowWolf.jpeg',
            lang: 'Français'
        }
    }

    const fillNews = (data: FillContentType) => {
        data.contentEditor.getLanguageSwitcher().select(data.lang);
        data.contentSection.collapse();
        data.contentSection.expand();
        data.contentSection.get().find('input[id="jnt:news_jcr:title"]').should('be.visible').type(data.title);
        data.contentSection.get().find('.cke_button__source.cke_button_off').should('be.visible').click();
        data.contentSection.get().find('textarea').should('be.visible').type(data.description);

        if (data.lang !== 'English') {
            data.contentSection.get().find('[data-sel-action="addField"]').click();
        } else {
            data.contentSection.get().find('input[id="jdmix:imgGallery"]').click();
            data.contentSection.get().find('[data-sel-action="addField"]').click();
        }
        const picker = getComponentByRole(PickerGrid, 'picker-dialog');
        picker.uploadFile(data.image);
        picker.wait(1000);
        picker.select();
        picker.wait(1000);
    }

    it('Can create content in 3 languages', {retries: 0}, function () {
        const contentEditor = pageComposer
            .openCreateContent()
            .getContentTypeSelector()
            .searchForContentType('News entry')
            .selectContentType('News entry')
            .create();
        cy.get('#contenteditor-dialog-title').should('be.visible').and('contain', 'Create News entry');
        const contentSection = contentEditor.openSection('Content');
        contentSection.expand();

        Object.keys(newsByLanguage).sort((a, b) => a === 'English' ? 1 : 0).forEach(key => {
            fillNews({contentEditor, contentSection, ...newsByLanguage[key]});
        });

        contentEditor.save();
        pageComposer.refresh().shouldContain(newsByLanguage.en.title);
    })
});
