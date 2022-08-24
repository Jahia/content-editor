import {BaseComponent, BasePage, Button, getComponent, getComponentByRole, getElement, MUIInput} from '@jahia/cypress';
import {JContent} from './jcontent';
import {ContentEditor} from './contentEditor';

export class CreateContent extends BasePage {
    jcontent: JContent;

    constructor(jcontent: JContent) {
        super();
        this.jcontent = jcontent;
    }

    open(): CreateContent {
        getComponentByRole(Button, 'createContent').click();
        return this;
    }

    getContentTypeSelector(): ContentTypeSelector {
        return getComponent(ContentTypeSelector);
    }
}

export class ContentTypeSelector extends BaseComponent {
    static defaultSelector = 'div[aria-labelledby="dialog-createNewContent"]';

    searchInput = getComponentByRole(MUIInput, 'content-type-dialog-input', this);

    searchForContentType(contentType: string): ContentTypeSelector {
        this.searchInput.type(contentType);
        return this;
    }

    selectContentType(contentType: string): ContentTypeSelector {
        getElement('[data-sel-role="content-type-tree"] span', this).contains(contentType).click();
        return this;
    }

    cancel(): void {
        getComponentByRole(Button, 'content-type-dialog-cancel', this).click();
    }

    create(): ContentEditor {
        getComponentByRole(Button, 'content-type-dialog-create', this).click();
        return new ContentEditor();
    }
}
