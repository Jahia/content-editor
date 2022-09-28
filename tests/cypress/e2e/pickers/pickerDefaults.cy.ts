import {contentTypes} from '../../fixtures/pickers/contentTypes';
import {JContent} from '../../page-object/jcontent';

describe('Picker default tests', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login(); // Edit in chief

        // BeforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    // Tests

    it('should open default page picker', () => {
        const contentType = contentTypes.pageDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'page');
    });

    it('should open default contentfolder picker', () => {
        const contentType = contentTypes.contentfolderDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'contentfolder');
    });

    it('should open default folder picker', () => {
        const contentType = contentTypes.folderDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'folder');
    });

    it('should open default file picker', () => {
        const contentType = contentTypes.fileDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'file');
    });

    it('should open default image picker', () => {
        const contentType = contentTypes.imageDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'image');
    });

    it('should open default editoriallink picker', () => {
        const contentType = contentTypes.editoriallinkDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'editoriallink');
    });

    it('should open default user picker', () => {
        const contentType = contentTypes.userDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'user');
    });

    it('should open default usergroup picker', () => {
        const contentType = contentTypes.usergroupDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'usergroup');
    });

    it('should open default site picker', () => {
        const contentType = contentTypes.siteDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'site');
    });

    it('should open default category picker', () => {
        const contentType = contentTypes.categoryDefault;
        const picker = jcontent
            .createContent(contentType.typeName)
            .getPickerField(contentType.fieldNodeType, contentType.multiple)
            .open();

        // Assert we have the right picker config type
        picker.get()
            .should('be.visible')
            .and('have.attr', 'data-sel-type', 'category');
    });
});
