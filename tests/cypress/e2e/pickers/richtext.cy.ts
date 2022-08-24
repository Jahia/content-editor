import {JContent} from '../../page-object/jcontent';

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
        cy.wait(500);

        const linkModal = richText.openLinkModal();
        const picker = linkModal.openBrowseServerContents();
        picker.getTable().getRowByIndex(2).get().click();
        picker.select();
        linkModal.ok();

        richText.getData().should('have.string', 'person-portrait');
    });

    it('File picker in richtext', () => {
        const contentEditor = jcontent.createContent('Rich text');
        const richText = contentEditor.getRichTextField('jnt:bigText_text');
        cy.wait(500);

        const linkModal = richText.openLinkModal();
        const picker = linkModal.openBrowseServerFiles();
        picker.getTable().getRowByIndex(1).get().dblclick();
        picker.getTable().getRowByIndex(1).get().dblclick();
        picker.getTable().getRowByIndex(1).get().click();
        picker.select();
        linkModal.ok();

        richText.getData().should('have.string', 'glyphicons-halflings');
    });
});

