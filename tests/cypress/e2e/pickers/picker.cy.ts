import {contentTypes} from "../../fixtures/pickers/contentTypes";
import {Picker} from "../../page-object/picker";
import {assertUtils} from "../../utils/assertUtils";
import {AccordionItem} from "../../page-object/accordionItem";
import {ContentEditor} from "../../page-object";
import gql from "graphql-tag";

describe('Picker tests', () => {

    const siteKey = 'digitall'
    let picker: Picker

    beforeEach(() => {
        // cy.executeGroovy('createSite.groovy', { SITEKEY: siteKey })
        cy.login() // edit in chief
        const pageComposer = ContentEditor.visit(siteKey, 'en', 'home.html').getPageComposer()
        picker = new Picker(pageComposer)
        // cy.runProvisioningScript({fileName:'pickers/install-qa-module.yaml',type:'application/yaml'})
    })

    afterEach(() => {
        cy.logout()
        // cy.executeGroovy('deleteSite.groovy', { SITEKEY: siteKey })
    })

    // tests

    it('should display content reference picker', () => {
        const pickerDialog = picker.open(contentTypes['contentReference'])

        // assert components are visible
        assertUtils.isVisible(pickerDialog.get())
        assertUtils.isVisible(pickerDialog.getSiteSwitcher())
        assertUtils.isVisible(pickerDialog.getAccordion())

        // assert pages accordion is expanded and populated
        const pagesAccordion:AccordionItem = pickerDialog.getAccordionItem('picker-pages');
        assertUtils.isAriaExpanded(pagesAccordion.getHeader())
        const rootTree = pagesAccordion.getTreeItems().first()
        rootTree.should('not.be.empty')

        // assert content accordion is visible
        pickerDialog.getAccordionItem('picker-contents').getHeader()
            .should('be.visible')
            .and('have.attr', 'aria-expanded')
            .and('equal', 'false')
    })


    it('should display file/image reference picker', () => {
        const pickerDialog = picker.open(contentTypes['fileReference'])

        // assert components are visible
        assertUtils.isVisible(pickerDialog.get())
        assertUtils.isVisible(pickerDialog.getSiteSwitcher())
        assertUtils.isVisible(pickerDialog.getAccordion())

        // assert media accordion is expanded and populated
        const pagesAccordion:AccordionItem = pickerDialog.getAccordionItem('picker-media');
        assertUtils.isAriaExpanded(pagesAccordion.getHeader())
        const rootTree = pagesAccordion.getTreeItems().first()
        rootTree.should('not.be.empty')
    })

    it('should go to previous location', () => {
        let pickerDialog = picker.open(contentTypes['fileReference'])
        let pagesAccordion:AccordionItem = pickerDialog.getAccordionItem('picker-media');
        assertUtils.isVisible(pagesAccordion.getHeader())

        cy.log('select files > images > companies')
        pagesAccordion.expandTreeItem('images')
        pagesAccordion.getTreeItem('companies').click()
        pickerDialog.cancel()

        cy.log('re-open file media picker')
        pickerDialog = picker.open(contentTypes['fileReference'])
        pagesAccordion = pickerDialog.getAccordionItem('picker-media');

        cy.log('verify files > images > companies still selected')
        pagesAccordion.getTreeItem('companies').find('div')
            .should('have.class', 'moonstone-selected')
    })

    it('should go to root when previous location is not available', () => {
        const folderName = "testPrevLocation"
        const parentPath = `/sites/${siteKey}/files/images`

        cy.log(`create folder '${folderName}' in files/images`)
        cy.apollo({
            mutationFile: 'pickers/createFolder.graphql',
            variables: { folderName, parentPath }
        })

        cy.log('open file picker dialog')
        let pickerDialog = picker.open(contentTypes['fileReference'])
        let pagesAccordion: AccordionItem = pickerDialog.getAccordionItem('picker-media');
        assertUtils.isVisible(pagesAccordion.getHeader())

        cy.log('assert created folder exists and select')
        pagesAccordion.expandTreeItem('images')
        pagesAccordion.getTreeItem(folderName).click().should('be.visible')
        pickerDialog.cancel()

        cy.log(`delete folder '${folderName}'`)
        cy.apollo({
            mutationFile: "pickers/deleteFolder.graphql",
            variables: { pathOrId: `${parentPath}/${folderName}`}
        })

        // cy.reload() // fixes issue of
        cy.log('re-open file picker')
        pickerDialog = picker.open(contentTypes['imageReference'])
        pagesAccordion = pickerDialog.getAccordionItem('picker-media');

        cy.log(`verify ${folderName} is not selected and root is selected`)
        pagesAccordion.getTreeItem(folderName).should('not.exist')
        pagesAccordion.getTreeItem('files').find('div')
            .should('have.class', 'moonstone-selected')
    })

})
