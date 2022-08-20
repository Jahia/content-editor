import { contentTypes } from '../../fixtures/pickers/contentTypes'
import { Picker } from '../../page-object/picker'
import { assertUtils } from '../../utils/assertUtils'
import { AccordionItem } from '../../page-object/accordionItem'
import { ContentEditor } from '../../page-object'
import { PickerField } from '../../page-object/pickerField'
import { PageComposer } from '../../page-object/pageComposer'

describe('Picker tests', () => {
    const siteKey = 'digitall'
    let pageComposer: PageComposer

    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login() // edit in chief
        cy.apollo({ mutationFile: 'pickers/createContent.graphql' })

        // beforeEach()
        pageComposer = ContentEditor.visit(siteKey, 'en', 'home.html').getPageComposer()
    })

    afterEach(() => {
        cy.apollo({ mutationFile: 'pickers/deleteContent.graphql' })
        cy.logout()
    })

    // tests

    it('should display content reference picker', () => {
        const pickerDialog = PickerField.getFromNewContent(pageComposer, contentTypes['contentReference']).open()

        // assert components are visible
        assertUtils.isVisible(pickerDialog.get())
        assertUtils.isVisible(pickerDialog.getSiteSwitcher())
        assertUtils.isVisible(pickerDialog.getAccordion())

        cy.log('assert pages accordion is expanded and populated')
        const pagesAccordion: AccordionItem = pickerDialog.getAccordionItem('picker-pages')
        pagesAccordion.getHeader().should('be.visible').and('have.attr', 'aria-expanded').and('equal', 'true')
        const rootTree = pagesAccordion.getTreeItems().first()
        rootTree.should('not.be.empty')

        cy.log('assert content accordion is visible')
        const contentAccordion: AccordionItem = pickerDialog.getAccordionItem('picker-content-folders')
        contentAccordion.getHeader().should('be.visible').and('have.attr', 'aria-expanded').and('equal', 'false')

        cy.log('check table components')
        pickerDialog.getTable().should('exist') // I have issues checking be.visible; use exist for now
        pickerDialog.getHeaderByName('Name').should('be.visible')
        pickerDialog.getHeaderByName('Last modified on').should('be.visible')
        pickerDialog.getHeaderByName('Type').should('be.visible')

        cy.log('selection content folders > contents > ce-picker-files reflects in table')
        contentAccordion.click()
        contentAccordion.getHeader().should('be.visible').and('have.attr', 'aria-expanded').and('equal', 'true')
        contentAccordion.getTreeItem('ce-picker-contents').click() // select contents folder
        pickerDialog.getTable().should('exist').and('have.length', 1)
        cy.wait(500) // need a wait to load table data
        pickerDialog
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-name"]')
            .should((elems) => {
                expect(elems).to.have.length(4)
                const texts = elems.get().map((e) => e.textContent)
                expect(texts.sort()).to.deep.eq(['content-folder1', 'test 1', 'test 2', 'test 3'])
            })

        cy.log('test double-click on table')
        pickerDialog.getTableRow('content-folder1').dblclick()
        contentAccordion.getTreeItem('content-folder1').find('div').should('have.class', 'moonstone-selected')
        pickerDialog
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-name"]')
            .should((elems) => {
                expect(elems).to.have.length(2)
                const texts = elems.get().map((e) => e.textContent)
                expect(texts).to.deep.eq(['test 4', 'test 5'])
            })
    })

    it('should display file/image reference picker', () => {
        const pickerDialog = PickerField.getFromNewContent(pageComposer, contentTypes['imageReference']).open()

        cy.log('assert components are visible')
        assertUtils.isVisible(pickerDialog.get())
        assertUtils.isVisible(pickerDialog.getSiteSwitcher())
        assertUtils.isVisible(pickerDialog.getAccordion())
        assertUtils.isVisible(pickerDialog.getTable())

        cy.log('assert media accordion is expanded and populated')
        const mediaAccordion: AccordionItem = pickerDialog.getAccordionItem('picker-media')
        assertUtils.isAriaExpanded(mediaAccordion.getHeader())
        const rootTree = mediaAccordion.getTreeItems().first()
        rootTree.should('not.be.empty')

        cy.log('check table components')
        pickerDialog.getTable().should('exist')
        pickerDialog.getHeaderByName('Name').should('be.visible')
        pickerDialog.getHeaderByName('Last modified on').should('be.visible')

        cy.log('selection media > files > ce-picker-files reflects in table and filtered by type')
        mediaAccordion.getTreeItem('ce-picker-files').click()
        pickerDialog.getTable().should('exist')
        cy.wait(500) // need a wait to load table data
        pickerDialog
            .getTable()
            .getRows()
            .get()
            .find('[data-cm-role="table-content-list-cell-name"]')
            .should((elems) => {
                expect(elems).to.have.length(2)
                const texts = elems.get().map((e) => e.textContent)
                expect(texts).to.deep.eq(['user.jpg', 'user2.jpg'])
                expect(texts).to.not.contain('doc1.pdf')
                expect(texts).to.not.contain('doc2.pdf')
            })
    })

    it('should go to previous location', () => {
        let pickerDialog = PickerField.getFromNewContent(pageComposer, contentTypes['fileReference']).open()

        let pagesAccordion: AccordionItem = pickerDialog.getAccordionItem('picker-media')
        assertUtils.isVisible(pagesAccordion.getHeader())

        cy.log('select files > images > companies')
        pagesAccordion.expandTreeItem('images')
        pagesAccordion.getTreeItem('companies').click()
        pickerDialog.cancel()

        cy.log('re-open file media picker')

        pickerDialog = PickerField.getFromNewContent(pageComposer, contentTypes['fileReference']).open()
        pagesAccordion = pickerDialog.getAccordionItem('picker-media')

        cy.log('verify files > images > companies still selected')
        pagesAccordion.getTreeItem('companies').find('div').should('have.class', 'moonstone-selected')
    })

    it('should go to root when previous location is not available', () => {
        const folderName = 'testPrevLocation'
        const parentPath = `/sites/${siteKey}/files/images`

        cy.log(`create folder '${folderName}' in files/images`)
        cy.apollo({
            mutationFile: 'pickers/createFolder.graphql',
            variables: { folderName, parentPath },
        })

        cy.log('open file picker dialog')
        let pickerDialog = PickerField.getFromNewContent(pageComposer, contentTypes['fileReference']).open()
        let pagesAccordion: AccordionItem = pickerDialog.getAccordionItem('picker-media')
        assertUtils.isVisible(pagesAccordion.getHeader())

        cy.log('assert created folder exists and select')
        pagesAccordion.expandTreeItem('images')
        pagesAccordion.getTreeItem(folderName).click().should('be.visible')
        pickerDialog.cancel()

        cy.log(`delete folder '${folderName}'`)
        cy.apollo({
            mutationFile: 'pickers/deleteFolder.graphql',
            variables: { pathOrId: `${parentPath}/${folderName}` },
        })

        cy.reload() // reload to sync folder
        cy.log('re-open file picker')
        pickerDialog = PickerField.getFromNewContent(pageComposer, contentTypes['imageReference']).open()
        pagesAccordion = pickerDialog.getAccordionItem('picker-media')

        cy.log(`verify ${folderName} is not selected and root is selected`)
        pagesAccordion.getTreeItem(folderName).should('not.exist')
        pagesAccordion.getTreeItem('files').find('div').should('have.class', 'moonstone-selected')
    })
})
