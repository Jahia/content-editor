import {
    createSite,
    createUser,
    deleteSite,
    deleteUser,
    grantRoles,
    addNode,
    getNodeByPath,
    deleteNodeProperty
} from '@jahia/cypress';

const getDate = (separator: string): string => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const trueDay = day < 10 ? '0' + day : day;
    const trueMonth = month < 10 ? '0' + month : month;

    return `${trueMonth}${separator}${trueDay}${separator}${year}`;
};

describe('Date picker tests', () => {
    before('Create required content', () => {
        createSite('testsite');
        createUser('myUser', 'password');
        grantRoles('/sites/testsite', ['editor'], 'myUser', 'USER');
        addNode({
            parentPathOrId: '/sites/testsite/contents',
            name: 'contentEditorTestContents',
            primaryNodeType: 'jnt:contentFolder'
        });
        addNode({
            parentPathOrId: '/sites/testsite/contents',
            name: 'contentEditorPickers',
            primaryNodeType: 'qant:pickers'
        });
    });

    beforeEach('Check datePicker is empty', () => {
        cy.login('myUser', 'password');
        getNodeByPath('/sites/testsite/contents/contentEditorPickers')
            .its('data.jcr.nodeByPath.uuid').as('datePicker');
        cy.get('@datePicker').then(uuid => {
            cy.visit(`/jahia/content-editor/en/edit/${uuid}`);
        });
        cy.get('input[id="qant:pickers_datepicker"]').should('have.value', '');
    });

    it('Test Date Picker', () => {
        cy.get('input[id="qant:pickers_datepicker"]').parent().find('button').click();
        cy.get('.DayPicker-Day--today').click();
    });

    it('Test without using picker', () => {
        cy.get('input[id="qant:pickers_datepicker"]').type(getDate(''));
    });

    afterEach('Check Value is kept after saving and clean picker', () => {
        cy.get('body').click();
        cy.get('input[id="qant:pickers_datepicker"]').should('have.value', getDate('/'));
        cy.get('span').contains('SAVE').click();
        cy.get('@datePicker').then(uuid => {
            cy.visit(`/jahia/content-editor/en/edit/${uuid}`);
        });
        cy.get('input[id="qant:pickers_datepicker"]').should('have.value', getDate('/'));
        deleteNodeProperty('/sites/testsite/contents/contentEditorPickers', 'datepicker', 'en');
        cy.reload();
        cy.get('input[id="qant:pickers_datepicker"]').should('have.value', '');
        cy.logout();
    });

    after('Remove tests content', () => {
        deleteUser('myUser');
        deleteSite('testsite');
    });
});
