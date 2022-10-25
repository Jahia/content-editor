import {JContent} from '../../page-object/jcontent';

describe('Picker tests - richtext', () => {
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

        richText.type('Hello');

        const linkModal = richText.openLinkModal();
        const picker = linkModal.openBrowseServerContents();
        picker.getTable().get().contains('Home').click();
        picker.select();
        linkModal.ok();

        richText.getData().should('have.string', 'home');
    });

    it('File picker in richtext', () => {
        const contentEditor = jcontent.createContent('Rich text');
        const richText = contentEditor.getRichTextField('jnt:bigText_text');

        richText.type('Hello');

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

