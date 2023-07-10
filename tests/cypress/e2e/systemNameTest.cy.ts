import {PageComposer} from '../page-object/pageComposer';
import {Button, getComponentByRole} from '@jahia/cypress';

describe('System name test', () => {
    const site = 'contentEditorSite';
    let pageComposer: PageComposer;

    before(function () {
        cy.loginAndStoreSession();
        cy.executeGroovy('createSite.groovy', {SITEKEY: site});
    });

    after(function () {
        cy.executeGroovy('deleteSite.groovy', {SITEKEY: site});
        cy.logout();
    });

    beforeEach(function () {
        cy.loginAndStoreSession();
        pageComposer = PageComposer.visit(site, 'en', 'home.html');
    });

    it('Cannot save with invalid system name', function () {
        const check = function () {
            cy.get('p').contains('Your content couldn’t be saved');
            getComponentByRole(Button, 'content-type-dialog-cancel').click();
            cy.get('p').contains('System name cannot consist of');
            getComponentByRole(Button, 'backButton').click();
            getComponentByRole(Button, 'close-dialog-discard').click();
        };

        pageComposer.createPage('list\'asasa\'an@##$%#$%@#%', true);
        check();
    });

    it('Create a page with chinese characters', function () {
        const check = function () {
            pageComposer.refresh();
            cy.url({decode: true}).should('contain', '这是一个测验');
        };

        pageComposer.createPage('这是一个测验', true);
        check();
    });

    it('Create a page with a reserved word', function () {
        const check = function () {
            pageComposer.refresh();
            cy.url({decode: true}).should('contain', '/home/sites');
        };

        pageComposer.createPage('sites', false);
        check();
    });

    it('Create a page with an accented characters', function () {
        const check = function () {
            pageComposer.refresh();
            cy.url({decode: true}).should('contain', 'eaoaeuéàöäèü');
        };

        pageComposer.createPage('éàöäèü', true);
        check();
    });

    it('Create a page with special characters', function () {
        const check = function () {
            cy.get('p').contains('Your content couldn’t be saved');
            getComponentByRole(Button, 'content-type-dialog-cancel').click();
            cy.get('p').contains('System name cannot consist of');
            getComponentByRole(Button, 'backButton').click();
            getComponentByRole(Button, 'close-dialog-discard').click();
        };

        pageComposer.createPage('[]*|/%', true);
        check();
    });

    it('Create a page with ".."', function () {
        const check = function () {
            pageComposer.refresh();
            cy.url({decode: true}).should('contain', '.-');
        };

        pageComposer.createPage('..', true);
        check();
    });

    it.only('Check system name sync', function () {
        pageComposer.checkSystemNameSync('-', '');
        pageComposer = PageComposer.visit(site, 'en', 'home.html');
        pageComposer.checkSystemNameSync('-1-1-', '1-1');
        pageComposer = PageComposer.visit(site, 'en', 'home.html');
        pageComposer.checkSystemNameSync('éàöäèü', 'eaoaeu');
        pageComposer = PageComposer.visit(site, 'en', 'home.html');
        pageComposer.checkSystemNameSync('[]-{}-()-!!', '');
    });
});
