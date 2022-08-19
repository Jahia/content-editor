import { BaseComponent, getComponentByAttr, getComponentByRole } from '@jahia/cypress'
import { PageComposer } from './pageComposer'
import { ContentType } from '../fixtures/pickers/contentTypes'
import { Picker } from './picker'

export class PickerField extends BaseComponent {
    static ADD_FIELD_SEL = 'button[data-sel-action="addField"]'

    static getFromNewContent(pageComposer: PageComposer, contentType: ContentType) {
        pageComposer.createContent(contentType.typeName)
        const r = getComponentByAttr(PickerField, 'data-sel-content-editor-field', contentType.fieldNodeType)
        r.contentType = contentType
        return r
    }

    contentType: ContentType

    open(): Picker {
        const buttonSelector = this.contentType.multiple ? PickerField.ADD_FIELD_SEL : '[data-sel-field-picker-action]'
        this.get().find(buttonSelector).click()
        return getComponentByRole(Picker, 'picker-dialog')
    }

    assertValue(value) {
        this.get().find('[data-sel-field-picker-name]').should('have.text', value)
    }

    assertHasNoValue() {
        this.get().find('[data-sel-field-picker-name]').should('not.exist')
    }
}
