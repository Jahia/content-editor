import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import FormBuilder from './FormBuilder';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';

jest.mock('formik');
jest.mock('~/ContentEditorSection/ContentEditorSection.context');
jest.mock('~/ContentEditor.context');

describe('FormBuilder component', () => {
    let context;
    let sectionContext;
    let formik;
    beforeEach(() => {
        context = {
            nodeData: {
                isSite: false,
                isPage: false,
                primaryNodeType: {
                    hasOrderableChildNodes: true
                }
            }
        };
        useContentEditorContext.mockReturnValue(context);
        sectionContext = {
            sections: [
                {displayName: 'content'},
                {displayName: 'Layout'}
            ]
        };
        useContentEditorSectionContext.mockReturnValue(sectionContext);
        formik = {};
        useFormikContext.mockReturnValue(formik);
    });

    it('should be empty', () => {
        sectionContext.sections = [];
        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme);

        expect(cmp.debug()).toBe('<Fragment />');
    });

    it('should display each section', () => {
        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).find('section');

        sectionContext.sections.forEach(section => {
            expect(cmp.find({section}).exists()).toBe(true);
            if (section.displayName === 'content') {
                expect(cmp.props()['data-sel-mode']).toBe('create');
            }
        });
    });

    it('should not display ordering section for page', () => {
        context.nodeData.isPage = true;

        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').exists()).toBeFalsy();
    });

    it('should not display ordering section for site', () => {
        context.nodeData.isSite = true;

        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').exists()).toBeFalsy();
    });

    it('should display ordering section', () => {
        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').exists()).toBeTruthy();
    });

    it('should display ordering section just after content section', () => {
        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.childAt(1).find('ChildrenSection').exists()).toBeTruthy();
    });

    it('should not display ordering section in create mode', () => {
        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').exists()).toBe(false);
    });

    it('should have section with only automatically order', () => {
        context.nodeData.primaryNodeType.hasOrderableChildNodes = false;
        formik.values = ({
            'jmix:orderedList': false
        });

        let cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').props().canAutomaticallyOrder).toBeTruthy();
        expect(cmp.find('ChildrenSection').props().canManuallyOrder).toBeFalsy();

        formik.values = ({
            'jmix:orderedList': true
        });

        cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').props().canAutomaticallyOrder).toBeTruthy();
        expect(cmp.find('ChildrenSection').props().canManuallyOrder).toBeFalsy();
    });

    it('should have section with only manually order', () => {
        formik.values = ({
            AnyOtherKey: 'withValue'
        });

        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').props().canAutomaticallyOrder).toBeFalsy();
        expect(cmp.find('ChildrenSection').props().canManuallyOrder).toBeTruthy();
    });

    it('should have section with automatically and manually order', () => {
        formik.values = ({
            'jmix:orderedList': false
        });

        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').props().canAutomaticallyOrder).toBeTruthy();
        expect(cmp.find('ChildrenSection').props().canManuallyOrder).toBeTruthy();
    });
});
