import {
    createSite,
    createUser,
    deleteSite,
    deleteUser,
    grantRoles,
    addNode,
    deleteNodeProperty
} from '@jahia/cypress';

import {ContentEditor} from '../../page-object/contentEditor';
import {DatePicker} from '../../page-object/datePicker';
import {JContent} from '../../page-object/jcontent';

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
        JContent.visit('testsite', 'en', 'content-folders/contents').editComponentByText('contentEditorPickers');
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
