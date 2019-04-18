import React from 'react';
import {shallow} from '@jahia/test-framework';

import {EditNodeProperty} from './EditNodeProperty';

describe('EditNodeProperty component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            classes: {},
            siteInfo: {languages: []},
            field: {formDefinition: {name: 'x'}},
            t: i18nKey => i18nKey
        };
        wrapper = shallow(<EditNodeProperty {...props}><div>test</div></EditNodeProperty>);
    });

    it('should render a "Shared in all languages" when field is not i18n and site have multiple languages', () => {
        let lang1 = {displayName: 'Deutsch', language: 'de', activeInEdit: true};
        let lang2 = {displayName: 'English', language: 'en', activeInEdit: true};

        testI18nBadgeRender(false, [lang1, lang2], true);
        testI18nBadgeRender(true, [lang1, lang2], false);
        testI18nBadgeRender(false, [lang1], false);
        testI18nBadgeRender(true, [lang1], false);
    });

    let testI18nBadgeRender = function (i18n, siteLanguages, expectedBadgeRendered) {
        props.field =
            {formDefinition: {name: 'x', selectorType: 'Text', i18n: i18n},
                targets: [{name: 'test'}]};
        props.siteInfo = {
            languages: siteLanguages
        };

        wrapper.setProps(props);

        const badgeComponent = wrapper.find({badgeContent: 'content-editor:label.contentEditor.edit.sharedLanguages'});
        expect(badgeComponent.exists()).toBe(expectedBadgeRendered);
    };
});
