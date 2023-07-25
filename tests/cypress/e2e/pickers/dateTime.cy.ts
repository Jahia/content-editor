import { createSite, createUser, grantRoles, addNode, getNodeByPath, deleteUser, deleteSite, deleteNodeProperty } from "@jahia/cypress"
import { JContent } from "../../page-object/jcontent";
import { DateTimePicker } from "../../page-object/dateTimePicker";
import { ContentEditor } from "../../page-object";

const visitDateTimePicker = () => {
    cy.get('@dateTimePicker').then(uuid => {
        cy.visit(`/jahia/jcontent/severalLanguages/fr/content-folders/contents#(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:fr,mode:edit,uuid:'${uuid}')))`);
    })
}

const deleteAndCheck = () => {
    const dateTimePicker = new DateTimePicker();
    deleteNodeProperty('/sites/testsite/contents/contentEditorPickers', 'datetimepicker', 'en');
    cy.wait(5000);
    visitDateTimePicker();
    cy.reload();
    dateTimePicker.checkTime('');
};

describe('DateTime picker tests', () => {
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
        })
    })

    beforeEach('Check dateTimePicker is empty', () => {
        cy.login('myUser', 'password');
        JContent.visit('testsite', 'en', 'content-folders/contents').editComponentByText('contentEditorPickers');
        getNodeByPath('/sites/testsite/contents/contentEditorPickers').its('data.jcr.nodeByPath.uuid').as('dateTimePicker');
    })

    it('Test DateTime Picker', () => {
        cy.login();
        const dateTimePicker = new DateTimePicker();
        const contentEditor = new ContentEditor();
        visitDateTimePicker();
        dateTimePicker.checkTime('');
        dateTimePicker.pickNowTime();
        cy.get('body').click();
        dateTimePicker.checkPickedNowTime();
        contentEditor.save();
        visitDateTimePicker();
        dateTimePicker.checkPickedNowTime();
        deleteAndCheck();
    });

    it('Test without DateTime Picker', () => {
        cy.login();
        const dateTimePicker = new DateTimePicker();
        const contentEditor = new ContentEditor();
        visitDateTimePicker();
        dateTimePicker.checkDate('');
        dateTimePicker.typeNowTime();
        cy.get('body').click();
        dateTimePicker.checkNowTime();
        contentEditor.save();
        dateTimePicker.checkNowTime();
        deleteAndCheck();
    })

    afterEach('Check Value is kept after saving and clean picker', () => {
        cy.logout();
    });

    after('Remove tests content', () => {
        deleteUser('myUser');
        deleteSite('testsite');
    });
})