import {JContent} from '../page-object/jcontent';

describe('Test ordering properties with multiple values', {retries: 0}, () => {
    const siteKey = 'digitall';
    let jcontent: JContent;

    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login(); // Edit in chief

        // BeforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'content-folders/contents');
    });

    afterEach(() => {
        cy.logout();
    });

    it('Drag value test2=2 in shared small text over test1=1', () => {
        const contentEditor = jcontent.createContent('All fields multiple');
        cy.get('div[data-sel-content-editor-field="qant:allFieldsMultiple_weakreference"]').scrollIntoView();
        const smallTextField = contentEditor.getSmallTextField('qant:allFieldsMultiple_sharedSmallText', true);
        const expectedValues = ['test1=1', 'test2=2'];
        smallTextField.checkValues(expectedValues);
        smallTextField.get().find('input[name="qant:allFieldsMultiple_sharedSmallText[1]"]').parents('div[draggable="true"]').drag('div[data-droppable-zone="qant:allFieldsMultiple_sharedSmallText[0]"]', {
            force: true,
            waitForAnimations: true
        }).then(success => {
            assert.isTrue(success);
            smallTextField.checkValues(expectedValues.reverse());
        });
    });

    it('Can add a new value test3=3 and drag it between test2=2 and test1=1', () => {
        const contentEditor = jcontent.createContent('All fields multiple');
        cy.get('div[data-sel-content-editor-field="qant:allFieldsMultiple_weakreference"]').scrollIntoView();
        const smallTextField = contentEditor.getSmallTextField('qant:allFieldsMultiple_sharedSmallText', true);
        const expectedValues = ['test1=1', 'test2=2'];
        const expectedValuesAfterAdd = ['test1=1', 'test2=2', 'test3=3'];
        const expectedValuesAfterDrag = ['test1=1', 'test3=3', 'test2=2'];
        smallTextField.checkValues(expectedValues);
        smallTextField.addNewValue('test3=3');
        smallTextField.checkValues(expectedValuesAfterAdd);
        smallTextField.get().find('input[name="qant:allFieldsMultiple_sharedSmallText[2]"]').parents('div[draggable="true"]').drag('div[data-droppable-zone="qant:allFieldsMultiple_sharedSmallText[1]"]', {
            force: true,
            waitForAnimations: true
        }).then(success => {
            assert.isTrue(success);
            cy.get('div[data-sel-content-editor-field="qant:allFieldsMultiple_weakreference"]').scrollIntoView();
            smallTextField.checkValues(expectedValuesAfterDrag);
        });
    });
});
