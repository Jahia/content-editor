import {addNode, createSite, createUser, deleteSite, getComponentByRole, getNodeByPath, grantRoles, Menu} from '@jahia/cypress';
import {SmallTextField} from '../page-object/fields';
import {JContent} from '../page-object/jcontent';
import {ContentEditor} from '../page-object';

describe('Test the save publish buttons flow', () => {
    const siteKey = 'savePublishButtonsFlow';
    const sitePath = '/sites/' + siteKey;
    const siteContentPath = sitePath + '/contents';
    const contentFolder = 'contentEditorTestContents';
    const contentTest = 'contentEditorAllFieldsSimple';
    const contentPath = siteContentPath + '/' + contentFolder + '/' + contentTest;
    const userName = 'editorInChief';
    const newSharedSmallTextValue = 'Adapted text';
    const langEN = 'en';
    const langDE = 'de';
    const languages = langEN + ',' + langDE;
    const siteConfig = {
        languages: languages,
        templateSet: 'dx-base-demo-templates',
        serverName: 'localhost',
        locale: langEN
    };

    before(function () {
        createUser(userName, 'password', [{name: 'preferredLanguage', value: langEN}]);
        createSite(siteKey, siteConfig);
        grantRoles('/sites/' + siteKey, ['editor-in-chief'], userName, 'USER');
        addNode({
            parentPathOrId: siteContentPath,
            name: contentFolder,
            primaryNodeType: 'jnt:contentFolder'
        });
        addNode({
            parentPathOrId: siteContentPath + '/' + contentFolder,
            name: contentTest,
            primaryNodeType: 'qant:allFields',
            properties: [
                {name: 'sharedSmallText', value: 'Initial text', language: 'en'},
                {name: 'sharedTextarea', value: 'Initial text in textarea', language: 'en'}
            ]
        });
    });

    after(function () {
        deleteSite(siteKey);
    });

    const checkContentEditorHeaderButtons = (contentEditor: ContentEditor, saveDisabled: boolean, publishDisabled: boolean) => {
        contentEditor.checkButtonStatus('submitSave', saveDisabled);
        contentEditor.checkButtonStatus('publishAction', publishDisabled);
    };

    const checkContentEditorHeaderMenu = (contentEditor: ContentEditor, ariaDisabledUnpublish: string) => {
        contentEditor.openContentEditorHeaderMenu();
        getComponentByRole(Menu, 'jcontent-publishMenu').should('be.visible').find('.moonstone-menuItem[data-sel-role="unpublish"]').should('have.attr', 'aria-disabled', ariaDisabledUnpublish);
        cy.get('body').click();
    };

    const updateAndSave = (contentEditor: ContentEditor) => {
        cy.log('Update sharedSmallText and save');
        contentEditor.getField(SmallTextField, 'qant:allFields_sharedSmallText').addNewValue(newSharedSmallTextValue, true);
        checkContentEditorHeaderButtons(contentEditor, true, false);
        contentEditor.save();
    };

    const publish = (contentEditor: ContentEditor) => {
        cy.log('Publish');
        checkContentEditorHeaderButtons(contentEditor, false, true);
        checkContentEditorHeaderMenu(contentEditor, 'true');
        contentEditor.publish();
        getNodeByPath(contentPath, ['sharedSmallText', 'j:lastPublishedBy'], langEN, null, 'LIVE').then((result => {
            expect(result?.data?.jcr?.nodeByPath?.name).eq('contentEditorAllFieldsSimple');
            expect(result?.data?.jcr?.nodeByPath?.properties?.find(property => property.name === 'j:lastPublishedBy')?.value).contains(userName);
            expect(result?.data?.jcr?.nodeByPath?.properties?.find(property => property.name === 'sharedSmallText')?.value).contains(newSharedSmallTextValue);
        }));
        checkContentEditorHeaderButtons(contentEditor, false, false);
        checkContentEditorHeaderMenu(contentEditor, 'false');
    };

    const unPublish = (contentEditor: ContentEditor) => {
        cy.log('Unpublish in all languages');
        contentEditor.openContentEditorHeaderMenu();
        getComponentByRole(Menu, 'jcontent-publishMenu').should('be.visible').find('.moonstone-menuItem[data-sel-role="unpublishInAllLanguages"]').should('have.attr', 'aria-disabled', 'false').click();
        cy.get('button.x-btn-text').contains('Unpublish all').click();
        cy.apollo({
            fetchPolicy: 'no-cache',
            variables: {
                path: contentPath
            },
            queryFile: 'graphql/jcrPublicationStatus.graphql'
        })
            .then(result => {
                const publicationStatus = result?.data?.jcr?.nodeByPath?.aggregatedPublicationInfo?.publicationStatus;
                return publicationStatus && publicationStatus === 'UNPUBLISHED';
            });
        checkContentEditorHeaderButtons(contentEditor, false, true);
        checkContentEditorHeaderMenu(contentEditor, 'true');
    };

    it('Check save publish buttons flow', () => {
        cy.log('Login with editor in chief');
        cy.login(userName, 'password');
        const jcontent = JContent.visit(siteKey, langEN, 'content-folders/contents');
        jcontent.viewSubContentComponentByText(contentFolder);
        const contentEditor = jcontent.editComponentByText(contentTest);
        contentEditor.switchToAdvancedMode();
        checkContentEditorHeaderButtons(contentEditor, false, true);
        checkContentEditorHeaderMenu(contentEditor, 'true');
        updateAndSave(contentEditor);
        publish(contentEditor);
        unPublish(contentEditor);
    });
});
