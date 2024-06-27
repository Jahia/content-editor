export class AdvancedOptions {
    checkOption(label: string, value?: string) {
        if (value !== undefined) {
            cy.get('div[data-sel-role="advanced-options-nav"]').should('be.visible').find('.moonstone-listItem').contains(label).parent().parent().find('.moonstone-chip').should('contain', value);
        }

        cy.get('div[data-sel-role="advanced-options-nav"]').should('be.visible').find('.moonstone-listItem').contains(label);
    }

    switchToOption(label: string) {
        cy.get('div[data-sel-role="advanced-options-nav"]').should('be.visible').find('.moonstone-listItem').contains(label).parent().parent().click();
    }
}
