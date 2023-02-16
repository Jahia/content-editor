import {Dropdown} from '@jahia/cypress';

export class LanguageSwitcher extends Dropdown {
    selectLang(displayLang: string) {
        this.select(displayLang).get()
            .find(`span[title="${displayLang}"]`)
            .should('be.visible');
    }
}
