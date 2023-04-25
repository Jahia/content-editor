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

import { ContentEditor } from '../../page-object/ContentEditor'
import { DatePicker } from '../../page-object/datePicker'

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
        const datePicker = new DatePicker();
        cy.login('myUser', 'password');
        getNodeByPath('/sites/testsite/contents/contentEditorPickers')
            .its('data.jcr.nodeByPath.uuid').as('datePicker');
        cy.get('@datePicker').then(uuid => {
            cy.visit(`/jahia/content-editor/en/edit/${uuid}`);
        });
        datePicker.checkDate('');
    });

    it('Test Date Picker', () => {
        const datePicker = new DatePicker();
        datePicker.pickTodayDate();
    });

    it('Test without using picker', () => {
        const datePicker = new DatePicker();
        datePicker.typeTodayDate();
    });

    afterEach('Check Value is kept after saving and clean picker', () => {
        const contentEditor = new ContentEditor();
        const datePicker = new DatePicker();
        cy.get('body').click();
        datePicker.checkTodayDate();
        contentEditor.save();
        cy.get('@datePicker').then(uuid => {
            cy.visit(`/jahia/content-editor/en/edit/${uuid}`);
        });
        datePicker.checkTodayDate();
        deleteNodeProperty('/sites/testsite/contents/contentEditorPickers', 'datepicker', 'en');
        cy.reload();
        datePicker.checkDate('');
        cy.logout();
    });

    after('Remove tests content', () => {
        deleteUser('myUser');
        deleteSite('testsite');
    });
});
