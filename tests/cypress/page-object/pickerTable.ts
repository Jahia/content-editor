import {getComponent, Table, TableRow} from "@jahia/cypress";

export class PickerTable extends Table {

    getHeaderById(id: string) {
        return cy.get(`[data-cm-role="table-content-list-header-cell-${id}"]`);
    }

    getRowNames() {
        return this.getRows().get().find('[data-cm-role="table-content-list-cell-name"]')
    }

    getRowByName(label: string) {
        return getComponent(TableRow, this).get()
            .filter(`:contains("${label}")`)
            .first()
            .scrollIntoView({ offset: { top: -150, left: 0 }, easing: 'linear', duration: 2000 })
    }

    getSelectedRows() {
        return this.get().find('tbody [data-cm-role="table-content-list-cell-selection"] input[aria-checked="true"]')
    }

    selectItems(count: number) {
        this.getRows().get()
            .then((elems) => {
                expect(elems.length).gte(count)
                const selectRow = (elem) =>
                    cy.wrap(elem).find('[data-cm-role="table-content-list-cell-selection"] input').click()
                for (let i = 0; i < count; i++) {
                    selectRow(elems.eq(i))
                }
            })
    }
}
