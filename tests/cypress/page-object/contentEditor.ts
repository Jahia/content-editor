import {
    BasePage,
    Button,
    Collapsible,
    getComponentByAttr,
    getComponentByRole,
    getComponentBySelector,
    Menu
} from '@jahia/cypress';
import {ComponentType} from '@jahia/cypress/src/page-object/baseComponent';
import {Field, PickerField, RichTextField, SmallTextField, DateField} from './fields';
import {LanguageSwitcher} from './languageSwitcher';
import {Breadcrumb} from './breadcrumb';

export class ContentEditor extends BasePage {
    static defaultSelector = '[aria-labelledby="dialog-content-editor"]';
    languageSwitcher: LanguageSwitcher;

    static getContentEditor() : ContentEditor {
        return getComponentBySelector(ContentEditor, ContentEditor.defaultSelector);
    }

    openSection(sectionName: string) {
        return getComponentBySelector(Collapsible, `[data-sel-content-editor-fields-group="${sectionName}"]`).expand();
    }

    closeSection(sectionName: string) {
        return getComponentBySelector(Collapsible, `[data-sel-content-editor-fields-group="${sectionName}"]`).collapse();
    }

    create() {
        getComponentByRole(Button, 'createButton').click();
        cy.get('#dialog-errorBeforeSave', {timeout: 1000}).should('not.exist');
        cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'Content successfully created');
    }

    save() {
        getComponentByRole(Button, 'submitSave').click();
        cy.get('#dialog-errorBeforeSave', {timeout: 1000}).should('not.exist');
        cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'Content successfully saved');
    }

    saveUnchecked() {
        getComponentByRole(Button, 'createButton').click();
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
        cy.get('#createAnother').check().should('have.attr', 'aria-checked', 'true');
    }

    removeAnotherContent() {
        cy.get('#createAnother').uncheck().should('have.attr', 'aria-checked', 'false');
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

    getLanguageSwitcher(): LanguageSwitcher {
        if (!this.languageSwitcher) {
            this.languageSwitcher = getComponentBySelector(LanguageSwitcher, '#contenteditor-dialog-title [data-cm-role="language-switcher"]');
        }

        return this.languageSwitcher;
    }

    getLanguageSwitcherAdvancedMode(): LanguageSwitcher {
        if (!this.languageSwitcher) {
            this.languageSwitcher = getComponentBySelector(LanguageSwitcher, '.moonstone-dropdown_container [data-cm-role="language-switcher"]');
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
        return this.getField(RichTextField, fieldName, false);
    }

    getPickerField(fieldName: string, multiple?: boolean): PickerField {
        return this.getField(PickerField, fieldName, multiple);
    }

    getSmallTextField(fieldName: string, multiple?: boolean): SmallTextField {
        return this.getField(SmallTextField, fieldName, multiple);
    }

    getDateField(fieldName: string): DateField {
        return this.getField(DateField, fieldName);
    }

    getField<FieldType extends Field>(FieldComponent: ComponentType<FieldType>, fieldName: string,
        multiple?: boolean): FieldType {
        const r = getComponentByAttr(FieldComponent, 'data-sel-content-editor-field', fieldName);
        r.fieldName = fieldName;
        r.multiple = multiple;
        return r;
    }

    toggleOption(optionType: string, optionFieldName: string) {
        cy.get(`span[data-sel-role-dynamic-fieldset="${optionType}"]`).scrollIntoView({offset: {left: 0, top: -100}}).find('input').click({force: true});
        cy.contains(optionFieldName, {timeout: 90000}).should('be.visible');
    }

    checkButtonStatus(role: string, enabled: boolean) {
        getComponentByRole(Button, role).should('be.visible').should(enabled ? 'not.be.disabled' : 'be.disabled');
    }

    openContentEditorHeaderMenu() {
        getComponentByRole(Button, 'ContentEditorHeaderMenu').click();
    }

    publish() {
        getComponentByRole(Button, 'publishAction').click();
        cy.get('#dialog-errorBeforeSave', {timeout: 1000}).should('not.exist');
        cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'Publication has been queue');
    }

    getBreadcrumb(content: string): Breadcrumb {
        return Breadcrumb.findByContent(content);
    }
}
