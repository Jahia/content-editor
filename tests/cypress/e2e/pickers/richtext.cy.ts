import {JContent} from '../../page-object/jcontent';
import {getElement} from "@jahia/cypress/dist/page-object/utils";
import {TableRow} from "@jahia/cypress";

describe('Picker - richtext', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    beforeEach(() => {
        cy.login();
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    it('Content picker in richtext', () => {
        const contentEditor = jcontent.createContent('Rich text');
        const richText = contentEditor.getRichTextField('jnt:bigText_text');
        cy.wait(5000);

        const linkModal = richText.openLinkModal();
        const picker = linkModal.openBrowseServerContents();
        picker.getTable().get().contains('Taber').click();
        picker.select();
        linkModal.ok();

        richText.getData().should('have.string', 'person-portrait');
    });

    it('File picker in richtext', () => {
        const contentEditor = jcontent.createContent('Rich text');
        const richText = contentEditor.getRichTextField('jnt:bigText_text');
        cy.wait(5000);

        const linkModal = richText.openLinkModal();
        const picker = linkModal.openBrowseServerFiles();
        picker.getTable().get().contains('images').dblclick();
        picker.getTable().get().contains('banners').dblclick();
        picker.getTable().get().contains('editing-digitall-site').click();
        picker.select();
        linkModal.ok();

        richText.getData().should('have.string', 'editing-digitall-site');
    });
});

