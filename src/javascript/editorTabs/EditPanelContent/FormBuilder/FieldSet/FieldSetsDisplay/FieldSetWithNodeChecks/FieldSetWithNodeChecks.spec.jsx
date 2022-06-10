import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorContext} from '~/contexts';
import {useNodeChecks} from '@jahia/data-helper';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {FieldSetWithNodeChecks} from './FieldSetWithNodeChecks';
import {FieldSet} from '../../FieldSet';

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => ({
    useContentEditorContext: jest.fn()
}));

jest.mock('@jahia/data-helper', () => {
    return {useNodeChecks: jest.fn()};
});

jest.mock('../../FieldSet', () => {
    return {FieldSet: jest.fn()};
});

describe('Filed set with node checks component', () => {
    let context = {
        path: '/',
        lang: 'en',
        uilang: 'en'
    };

    it('should display nothing', () => {
        useContentEditorContext.mockImplementation(() => (context));

        useNodeChecks.mockImplementation(() => ({
            node: {
                [Constants.permissions.setContentLimitsOnAreas]: true
            }
        }));

        FieldSet.mockImplementation(() => 'this is fieldset mock');

        const cmp = shallowWithTheme(<FieldSetWithNodeChecks fieldset={{displayName: 'myname', nodeCheck: {}, visibilityFunction: () => false}}/>, {}, dsGenericTheme);
        expect(cmp.debug()).toBe('');
    });

    it('should display field set', () => {
        useContentEditorContext.mockImplementation(() => (context));

        useNodeChecks.mockImplementation(() => ({
            node: {
                [Constants.permissions.setContentLimitsOnAreas]: true
            }
        }));

        FieldSet.mockImplementation(() => 'this is fieldset mock');

        const cmp = shallowWithTheme(<FieldSetWithNodeChecks fieldset={{displayName: 'myname', nodeCheck: {}, visibilityFunction: () => true}}/>, {}, dsGenericTheme);
        expect(cmp.find('mockConstructor').exists()).toBeTruthy();
    });

    it('should display custom component', () => {
        useContentEditorContext.mockImplementation(() => (context));

        useNodeChecks.mockImplementation(() => ({
            node: {
                [Constants.permissions.setContentLimitsOnAreas]: true
            }
        }));

        FieldSet.mockImplementation(() => 'this is fieldset mock');

        const C = () => <div>Hello</div>;
        const cmp = shallowWithTheme(<FieldSetWithNodeChecks fieldset={{displayName: 'myname', comp: C, nodeCheck: {}, visibilityFunction: () => true}}/>, {}, dsGenericTheme);
        expect(cmp.dive().find('div').exists()).toBeTruthy();
    });
});
