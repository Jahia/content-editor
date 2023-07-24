import {addNode, createSite, createUser, deleteSite, getNodeByPath, grantRoles, setNodeProperty} from '@jahia/cypress';

const TwoLanguagesSiteKey = 'severalLanguages';
const OneLanguageSiteKey = 'oneLanguage';
const editorLogin = {username: 'languagesEditor', password: 'password'};

const addQaModuleToSite = siteKey => {
    getNodeByPath('/sites/' + siteKey, ['j:installedModules']).its('data.jcr.nodeByPath.properties[0].values').as('installedModules');

    cy.get('@installedModules').then(result => {
        const resultArr = [];
        Cypress.$(result).each((index, value) => {
            resultArr.push(value);
        });
        resultArr.push('qa-module');
        setNodeProperty('/sites/' + siteKey, 'j:installedModules', resultArr, 'en');
    });
};

const checkFields = (siteKey, fieldValue, language) => {
    getNodeByPath(`/sites/${siteKey}/contents/all-fields`, ['smallText', 'textarea'], language).then(result => {
        result = result.data.jcr.nodeByPath.properties;

        Cypress.$(result).each((index, property) => {
            expect(property.value).to.eq(fieldValue);
        });
    });
};

const setCopyLanguage = uuid => {
    cy.visit(`/jahia/jcontent/severalLanguages/fr/content-folders/contents#(contentEditor:!((formKey:modal_0,isFullscreen:!t,lang:fr,mode:edit,uuid:'${uuid}')))`);
    cy.get('button[data-sel-role=\'3dotsMenuAction\']').click();
    cy.get('[data-sel-role=\'jcontent-content-editor/header/3dots\']').find('li:contains(\'Copy from languages\')').click();
    cy.get('div[role=\'document\']').find('div[role=\'dropdown\']:contains(\'Unselected\')').find('span').click();
    cy.get('menu:contains(\'English\')').find('li:contains(\'English\')').click();
};

describe('test copyFromOneLanguageToCurrentLanguage', () => {
    before('Create testsites', () => {
        cy.login();
        createSite(TwoLanguagesSiteKey, {languages: 'en,fr', templateSet: 'dx-base-demo-template', serverName: 'localhost', locale: 'en'});
        createSite(OneLanguageSiteKey, {templateSet: 'qa-simpleTemplateSet', serverName: 'localhost', locale: 'en'});
        createUser(editorLogin.username, editorLogin.password);
        grantRoles(`/sites/${TwoLanguagesSiteKey}`, ['editor'], editorLogin.username, 'USER');
        grantRoles(`/sites/${OneLanguageSiteKey}`, ['editor'], editorLogin.username, 'USER');
        addQaModuleToSite(TwoLanguagesSiteKey);
        addQaModuleToSite(OneLanguageSiteKey);
        cy.logout();
    });

    it('test', () => {
        cy.login(editorLogin.username, editorLogin.password);

        addNode({
            parentPathOrId: `/sites/${TwoLanguagesSiteKey}/contents`,
            primaryNodeType: 'qant:allFields',
            name: 'all-fields',
            properties: [{name: 'smallText', value: 'Text in English', language: 'en'}, {name: 'textarea', value: 'Text in English', language: 'en'}]
        }).its('data.jcr.addNode.uuid').as('allFieldsUuid');

        checkFields(TwoLanguagesSiteKey, 'Text in English', 'en');

        checkFields(TwoLanguagesSiteKey, '', 'fr');

        cy.get('@allFieldsUuid').then(uuid => {
            setCopyLanguage(uuid);
            cy.get('div[role=\'document\']').find('button:contains(\'Cancel\')').click();
            checkFields(TwoLanguagesSiteKey, '', 'fr');

            setCopyLanguage(uuid);
            cy.get('div[role=\'document\']').find('button:contains(\'Apply\')').click();
            cy.get(('button[data-sel-role=\'submitSave\']')).click();

            checkFields(TwoLanguagesSiteKey, 'Text in English', 'fr');
            setNodeProperty(`/sites/${TwoLanguagesSiteKey}/contents/all-fields`, 'smallText', 'Text in French', 'fr');
            setNodeProperty(`/sites/${TwoLanguagesSiteKey}/contents/all-fields`, 'textarea', 'Text in French', 'fr');
            checkFields(TwoLanguagesSiteKey, 'Text in French', 'fr');

            setNodeProperty(`/sites/${TwoLanguagesSiteKey}/contents/all-fields`, 'smallText', '', 'en');
            setNodeProperty(`/sites/${TwoLanguagesSiteKey}/contents/all-fields`, 'textarea', 'Other text in English', 'en');

            setCopyLanguage(uuid);
            cy.get('div[role=\'document\']').find('button:contains(\'Apply\')').click();
            cy.get(('button[data-sel-role=\'submitSave\']')).click();
        });

        getNodeByPath(`/sites/${TwoLanguagesSiteKey}/contents/all-fields`, ['smallText', 'textarea'], 'fr').then(result => {
            result = result.data.jcr.nodeByPath.properties;

            Cypress.$(result).each((index, property) => {
                if (property.name === 'smallText') {
                    expect(property.value).to.eq('Text in French');
                }

                if (property.name === 'textarea') {
                    expect(property.value).to.eq('Other text in English');
                }
            });
        });

        cy.logout();
    });

    after('Delete testsites', () => {
        deleteSite(TwoLanguagesSiteKey);
        deleteSite(OneLanguageSiteKey);
    });
});
