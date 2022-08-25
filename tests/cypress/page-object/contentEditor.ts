import {
    BasePage,
    Button,
    Collapsible,
    Dropdown,
    getComponentByAttr,
    getComponentByRole,
    getComponentBySelector,
    Menu
} from '@jahia/cypress';
import {PickerField} from './pickerField';
import {RichTextField} from './richTextField';

export class ContentEditor extends BasePage {
    languageSwitcher: Dropdown;

    openSection(sectionName: string) {
        return getComponentBySelector(Collapsible, `[data-sel-content-editor-fields-group="${sectionName}"]`).expand();
    }

    closeSection(sectionName: string) {
        return getComponentBySelector(Collapsible, `[data-sel-content-editor-fields-group="${sectionName}"]`).collapse();
    }

    save() {
        getComponentByRole(Button, 'createButton').click();
        cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'Content successfully created');
    }

    editSavedContent() {
        cy.get('[role="alertdialog"]').should('be.visible').find('.moonstone-button').click();
    }

    cancel() {
        getComponentByRole(Button, 'backButton').click();
    }

    cancelAndDiscard() {
        getComponentByRole(Button, 'backButton').click();
        getComponentByRole(Button, 'close-dialog-discard').click();
    }

    addAnotherContent() {
        cy.get('#createAnother').check();
    }

    removeAnotherContent() {
        cy.get('#createAnother').uncheck();
    }

    activateWorkInProgressMode(language?: string) {
        if (language === undefined) {
            getComponentByRole(Button, '3dotsMenuAction').click();
            getComponentBySelector(Menu, '#menuHolder').selectByRole('goToWorkInProgress');
            cy.get('[data-sel-role="wip-info-chip"]').should('contain', 'Work in progress');
        } else if (language === 'ALL') {
            // Activate all properties
            getComponentByRole(Button, '3dotsMenuAction').click();
            getComponentBySelector(Menu, '#menuHolder').selectByRole('goToWorkInProgress');
            cy.get('[data-sel-role="WIP"]').click();
            cy.get('input[type="radio"]').filter('input[value="ALL_CONTENT"]').click();
            cy.get('.moonstone-button').filter(':contains("Done")').click();
            cy.get('[data-sel-role="wip-info-chip"]').should('contain', 'Work in progress');
        } else {
            // Activate all properties
            getComponentByRole(Button, '3dotsMenuAction').click();
            getComponentBySelector(Menu, '#menuHolder').selectByRole('goToWorkInProgress');
            cy.get('[data-sel-role="WIP"]').click();
            language.split(',').forEach(value => {
                cy.get('input[type="checkbox"]').check(value);
            });
            cy.get('.moonstone-button').filter(':contains("Done")').click();
            cy.get('[data-sel-role="wip-info-chip"]').should('contain', 'WIP - EN');
        }
    }

    getLanguageSwitcher(): Dropdown {
        if (!this.languageSwitcher) {
            this.languageSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'language-switcher');
        }

        return this.languageSwitcher;
    }

    switchToAdvancedMode() {
        getComponentByRole(Button, 'advancedMode').should('be.visible').click();
    }

    validateContentIsVisibleInPreview(content: string) {
        cy.iframe('[data-sel-role="edit-preview-frame"]', {timeout: 90000, log: true}).within(() => {
            cy.contains(content, {timeout: 90000}).should('be.visible');
        });
    }

    getRichTextField(fieldName: string): RichTextField {
        cy.window().its('CKEDITOR').its('instances').should(instances => {
            assert(instances[Object.keys(instances)[0]].instanceReady);
        });

        const r = getComponentByAttr(RichTextField, 'data-sel-content-editor-field', fieldName);
        r.fieldName = fieldName;
        return r;
    }

    getPickerField(fieldName: string, multiple?: boolean): PickerField {
        const r = getComponentByAttr(PickerField, 'data-sel-content-editor-field', fieldName);
        r.fieldName = fieldName;
        r.multiple = multiple;
        return r;
    }
}
