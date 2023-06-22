import {contentTypes} from '../../fixtures/pickers/contentTypes';
import {assertUtils} from '../../utils/assertUtils';
import {AccordionItem} from '../../page-object/accordionItem';
import {JContent} from '../../page-object/jcontent';

describe('Picker tests', () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.loginEditor(); // Edit in chief
        cy.apollo({mutationFile: 'pickers/createContent.graphql'});

        // BeforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.apollo({mutationFile: 'pickers/deleteContent.graphql'});
        cy.logout();
    });

    // Tests

    it('should display content reference picker', () => {
        const picker = jcontent
            .createContent(contentTypes.contentReference.typeName)
            .getPickerField(contentTypes.contentReference.fieldNodeType, contentTypes.contentReference.multiple)
            .open();

        // Assert components are visible
        assertUtils.isVisible(picker.get());
        assertUtils.isVisible(picker.getSiteSwitcher());
        assertUtils.isVisible(picker.getAccordion());

        cy.log('assert pages accordion is expanded and populated');
        const pagesAccordion: AccordionItem = picker.getAccordionItem('picker-pages');
        pagesAccordion.getHeader().should('be.visible').and('have.attr', 'aria-expanded').and('equal', 'true');
        const rootTree = pagesAccordion.getTreeItems().first();
        rootTree.should('not.be.empty');

        cy.log('assert content accordion is visible');
        const contentAccordion: AccordionItem = picker.getAccordionItem('picker-content-folders');
        contentAccordion.getHeader().should('be.visible').and('have.attr', 'aria-expanded').and('equal', 'false');

        cy.log('check table components');
        picker.getTable().should('exist'); // I have issues checking be.visible; use exist for now
        picker.getTable().getHeaderById('name').should('be.visible');
        picker.getTable().getHeaderById('lastModified').should('be.visible');
        picker.getTable().getHeaderById('type').should('be.visible');

        cy.log('selection content folders > contents > ce-picker-files reflects in table');
        contentAccordion.click();
        contentAccordion.getHeader().should('be.visible').and('have.attr', 'aria-expanded').and('equal', 'true');
        contentAccordion.getTreeItem('ce-picker-contents').click(); // Select contents folder
        picker.getTable().should('exist').and('have.length', 1);

        picker
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-name"]')
            .should(elems => {
                expect(elems).to.have.length(4);
                const texts = elems.get().map(e => e.textContent);
                expect(texts.sort()).to.deep.eq(['content-folder1', 'test 1', 'test 2', 'test 3']);
            });

        cy.log('test double-click on table');
        picker.getTableRow('content-folder1').dblclick();
        contentAccordion.getTreeItem('content-folder1').find('div').should('have.class', 'moonstone-selected');
        picker
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-name"]')
            .should(elems => {
                expect(elems).to.have.length(2);
                const texts = elems.get().map(e => e.textContent);
                expect(texts).to.deep.eq(['test 4', 'test 5']);
            });
    });

    it('should display file/image reference picker', () => {
        const picker = jcontent
            .createContent(contentTypes.imageReference.typeName)
            .getPickerField(contentTypes.imageReference.fieldNodeType, contentTypes.imageReference.multiple)
            .open();

        cy.log('assert components are visible');
        assertUtils.isVisible(picker.get());
        assertUtils.isVisible(picker.getSiteSwitcher());
        assertUtils.isVisible(picker.getAccordion());
        assertUtils.isVisible(picker.getGrid());

        cy.log('assert media accordion is expanded and populated');
        const mediaAccordion: AccordionItem = picker.getAccordionItem('picker-media');
        assertUtils.isAriaExpanded(mediaAccordion.getHeader());
        const rootTree = mediaAccordion.getTreeItems().first();
        rootTree.should('not.be.empty');

        cy.log('check grid components');
        picker.getGrid().should('exist');

        cy.log('selection media > files > ce-picker-files reflects in table and filtered by type');
        mediaAccordion.getTreeItem('ce-picker-files').click();
        picker.getGrid().should('exist');
        picker
            .getGrid()
            .get()
            .find('[data-cm-role="grid-content-list-card-name"]')
            .should(elems => {
                expect(elems).to.have.length(2);
                const texts = elems.get().map(e => e.textContent);
                expect(texts).to.deep.eq(['user.jpg', 'user2.jpg']);
                expect(texts).to.not.contain('doc1.pdf');
                expect(texts).to.not.contain('doc2.pdf');
            });
    });

    it('should go to previous location', () => {
        const contentEditor = jcontent.createContent(contentTypes.fileReference.typeName);

        let picker = contentEditor
            .getPickerField(contentTypes.fileReference.fieldNodeType, contentTypes.fileReference.multiple)
            .open();

        let pagesAccordion: AccordionItem = picker.getAccordionItem('picker-media');
        assertUtils.isVisible(pagesAccordion.getHeader());

        cy.log('select files > images > companies');
        pagesAccordion.expandTreeItem('images');
        pagesAccordion.getTreeItem('companies').click();
        picker.cancel();

        cy.log('re-open file media picker');

        picker = contentEditor
            .getPickerField(contentTypes.fileReference.fieldNodeType, contentTypes.fileReference.multiple)
            .open();
        pagesAccordion = picker.getAccordionItem('picker-media');

        cy.log('verify files > images > companies still selected');
        pagesAccordion.getTreeItem('companies').find('div').should('have.class', 'moonstone-selected');
    });

    it('should go to root when previous location is not available', () => {
        const folderName = 'testPrevLocation';
        const parentPath = `/sites/${siteKey}/files/images`;

        cy.log(`create folder '${folderName}' in files/images`);
        cy.apollo({
            mutationFile: 'pickers/createFolder.graphql',
            variables: {folderName, parentPath}
        });

        cy.log('open file picker dialog');
        const contentEditor = jcontent.createContent(contentTypes.fileReference.typeName);
        let picker = contentEditor
            .getPickerField(contentTypes.fileReference.fieldNodeType, contentTypes.fileReference.multiple)
            .open();
        let pagesAccordion: AccordionItem = picker.getAccordionItem('picker-media');
        assertUtils.isVisible(pagesAccordion.getHeader());

        cy.log('assert created folder exists and select');
        pagesAccordion.expandTreeItem('images');
        pagesAccordion.getTreeItem(folderName).click().should('be.visible');
        picker.cancel();
        contentEditor.cancel();
        cy.log(`delete folder '${folderName}'`);
        cy.apollo({
            mutationFile: 'pickers/deleteFolder.graphql',
            variables: {pathOrId: `${parentPath}/${folderName}`}
        });

        cy.reload(); // Reload to sync folder
        const contentEditor2 = jcontent.createContent(contentTypes.fileReference.typeName);

        cy.log('re-open file picker');

        picker = contentEditor2
            .getPickerField(contentTypes.fileReference.fieldNodeType, contentTypes.fileReference.multiple)
            .open();
        pagesAccordion = picker.getAccordionItem('picker-media');

        cy.log(`verify ${folderName} is not selected and root is selected`);
        pagesAccordion.getTreeItem(folderName).should('not.exist');
        pagesAccordion.getTreeItem('files').find('div').should('have.class', 'moonstone-selected');
    });

    it('should be able to switch site', () => {
        const pickerField = jcontent
            .createContent(contentTypes.fileReference.typeName)
            .getPickerField(contentTypes.fileReference.fieldNodeType, contentTypes.fileReference.multiple);
        const picker = pickerField.open();

        picker.getTable().getRowByLabel('ce-picker-files').should('be.visible');
        picker.getSiteSwitcher().should('contain', 'Digitall');
        picker.getSiteSwitcher().select('System Site');
        picker.getSiteSwitcher().should('contain', 'System Site');
        picker.assertHasNoTable();
        picker.getSiteSwitcher().select('Digitall');
        picker.getTable().getRowByLabel('ce-picker-files');
    });

    it('should be able to browse when there is a selection', () => {
        const pickerField = jcontent
            .createContent(contentTypes.fileReference.typeName)
            .getPickerField(contentTypes.fileReference.fieldNodeType, contentTypes.fileReference.multiple);
        const picker = pickerField.open();

        picker.getTable().getRowByLabel('images').dblclick();
        picker.getTable().getRowByLabel('banners').dblclick();
        picker.getTable().getRowByLabel('editing-digitall-site.jpg').dblclick();

        picker.getSiteSwitcher().select('System Site');
        picker.getSiteSwitcher().should('contain', 'System Site');
        picker.assertHasNoTable();
        picker.getSiteSwitcher().select('Digitall');
        picker.getTable().getRowByLabel('ce-picker-files');
        const item = picker.getAccordionItem('picker-media');
        item.getTreeItem('files').find('div').should('have.class', 'moonstone-selected');
        item.getTreeItem('companies').click();
        item.getTreeItem('companies').find('div').should('have.class', 'moonstone-selected');
    });

    it('should pick thumbnail on double click', () => {
        const contentEditor = jcontent.createContent(contentTypes.fileReference.typeName);

        const picker = contentEditor
            .getPickerField(contentTypes.fileReference.fieldNodeType, contentTypes.fileReference.multiple)
            .open();

        const pagesAccordion: AccordionItem = picker.getAccordionItem('picker-media');

        pagesAccordion.expandTreeItem('images');
        pagesAccordion.getTreeItem('companies').click();
        picker.switchViewMode('Thumbnails');
        picker.getGrid().get().find('div[data-sel-role-card="allrealtylogo_light.png"]').dblclick({force: true});
        contentEditor.getPickerField(contentTypes.fileReference.fieldNodeType, contentTypes.fileReference.multiple).checkValue('allrealtylogo_light.png');
    });
});
