import {Table, TableRow} from '@jahia/cypress';
import Chainable = Cypress.Chainable;

export class ContentTable extends Table {
    getRowByLabel(label: string): TableRow {
        cy.contains('[data-cm-role="table-content-list-row"]', label).first().as('rowByLabel');
        cy.get('@rowByLabel').scrollIntoView();
        cy.get('@rowByLabel').should('be.visible');
        return new TableRow(cy.get('@rowByLabel'));
    }

    selectRowByLabel(label: string, isSelected = true): Chainable {
        return this.getRowByLabel(label).get()
            .find('[data-cm-role="table-content-list-cell-selection"] input')
            .click()
            .should('have.attr', 'aria-checked', Boolean(isSelected).toString());
    }
}
