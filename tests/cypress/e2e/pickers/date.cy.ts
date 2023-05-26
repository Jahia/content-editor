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

import {ContentEditor} from '../../page-object/contentEditor';
import {DatePicker} from '../../page-object/datePicker';

const saveAndCheck = () => {
    const datePicker = new DatePicker();
    const contentEditor = new ContentEditor();
    contentEditor.save();
    cy.get('@datePicker').then(uuid => {
        cy.visit(`/jahia/content-editor/en/edit/${uuid}`);
    });
    datePicker.checkTodayDate();
};

const deleteAndCheck = () => {
    const datePicker = new DatePicker();
    deleteNodeProperty('/sites/testsite/contents/contentEditorPickers', 'datepicker', 'en');
    cy.reload();
    datePicker.checkDate('');
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
    });

    it('Test Date Picker', () => {
        const datePicker = new DatePicker();
        datePicker.checkDate('');
        datePicker.pickTodayDate();
        cy.get('body').click();
        datePicker.checkTodayDate();
        saveAndCheck();
        deleteAndCheck();
    });

    it('Test without using picker', () => {
        const datePicker = new DatePicker();
        datePicker.checkDate('');
        datePicker.typeTodayDate();
        cy.get('body').click();
        datePicker.checkTodayDate();
        saveAndCheck();
        deleteAndCheck();
    });

    afterEach('Check Value is kept after saving and clean picker', () => {
        cy.logout();
    });

    after('Remove tests content', () => {
        deleteUser('myUser');
        deleteSite('testsite');
    });
});
