import {getComponent, getComponentBySelector, Table, TableRow} from '@jahia/cypress';

export class PickerTable extends Table {
    getHeaderById(id: string) {
        return this.get().find(`[data-cm-role="table-content-list-header-cell-${id}"]`);
    }

    getRows(assertion?: (s: JQuery) => void): PickerTableRow {
        return getComponent(PickerTableRow, this, assertion);
    }

    getRowByName(name: string) {
        return getComponentBySelector(PickerTableRow, `[data-sel-name="${name}"]`, this);
    }

    getSelectedRows() {
        return this.get().find('tbody [data-cm-role="table-content-list-cell-selection"] input[aria-checked="true"]');
    }

    getRowByLabel(label: string) {
        return getComponent(TableRow, this).get()
            .filter(`:contains("${label}")`)
            .first()
            .scrollIntoView({offset: {top: -150, left: 0}, easing: 'linear', duration: 2000});
    }

    selectItems(count: number) {
        this.getRows().get()
            .then(elems => {
                expect(elems.length).gte(count);
                const selectRow = elem =>
                    cy.wrap(elem)
                        .find('[data-cm-role="table-content-list-cell-selection"] input')
                        .click()
                        .should('have.attr', 'aria-checked', 'true');
                for (let i = 0; i < count; i++) {
                    selectRow(elems.eq(i));
                }
            });
    }
}

export class PickerTableRow extends TableRow {
    getCellByRole(role: string) {
        return this.get().find(`td[data-cm-role="table-content-list-cell-${role}"]`);
    }

    // For structured view
    expand() {
        this.getCellByRole('name').find('> div > svg').click();
        return this;
    }
}
