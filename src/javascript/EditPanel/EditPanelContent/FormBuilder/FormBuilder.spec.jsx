import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import FormBuilder from './FormBuilder';

jest.mock('formik', () => {
    let formikvaluesmock;

    return {
        Form: jest.fn(),
        connect: Cmp => props => (
            <Cmp {...props} formik={{values: formikvaluesmock}}/>
        ),
        setFormikValues: values => {
            formikvaluesmock = values;
        }
    };
});

jest.mock('~/ContentEditorSection/ContentEditorSection.context', () => {
    let sectionContextmock;
    return {
        useContentEditorSectionContext: () => {
            return sectionContextmock;
        },
        setSectionContext: c => {
            sectionContextmock = c;
        }
    };
});

jest.mock('~/ContentEditor.context', () => {
    let contextmock;
    return {
        useContentEditorContext: () => {
            return contextmock;
        },
        setContext: c => {
            contextmock = c;
        }
    };
});
import {setFormikValues} from 'formik';
import {setContext} from '~/ContentEditor.context';
import {setSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';

describe('FormBuilder component', () => {
    let context;
    let sectionContext;
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
        sectionContext = {
            sections: [
                {displayName: 'content'},
                {displayName: 'Layout'}
            ]
        };
    });

    it('should be empty', () => {
        setContext({});
        setSectionContext({});
        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).dive();

        expect(cmp.debug()).toBe('<Fragment />');
    });

    it('should display each section', () => {
        setContext(context);
        setSectionContext(sectionContext);
        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).dive().find('section');

        sectionContext.sections.forEach(section => {
            expect(cmp.find({section}).exists()).toBe(true);
            if (section.displayName === 'content') {
                expect(cmp.props()['data-sel-mode']).toBe('create');
            }
        });
    });

    it('should not display ordering section for page', () => {
        context.nodeData.isPage = true;
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.find('ChildrenSection').exists()).toBeFalsy();
    });

    it('should not display ordering section for site', () => {
        context.nodeData.isSite = true;
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.find('ChildrenSection').exists()).toBeFalsy();
    });

    it('should display ordering section', () => {
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.find('ChildrenSection').exists()).toBeTruthy();
    });

    it('should display ordering section just after content section', () => {
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.childAt(1).find('ChildrenSection').exists()).toBeTruthy();
    });

    it('should not display ordering section in create mode', () => {
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.find('ChildrenSection').exists()).toBe(false);
    });

    it('should have section with only automatically order', () => {
        context.nodeData.primaryNodeType.hasOrderableChildNodes = false;
        setContext(context);
        setSectionContext(sectionContext);
        setFormikValues({
            'jmix:orderedList': false
        });

        let cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.find('ChildrenSection').props().canAutomaticallyOrder).toBeTruthy();
        expect(cmp.find('ChildrenSection').props().canManuallyOrder).toBeFalsy();

        setFormikValues({
            'jmix:orderedList': true
        });

        cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.find('ChildrenSection').props().canAutomaticallyOrder).toBeTruthy();
        expect(cmp.find('ChildrenSection').props().canManuallyOrder).toBeFalsy();
    });

    it('should have section with only manually order', () => {
        setContext(context);
        setSectionContext(sectionContext);
        setFormikValues({
            AnyOtherKey: 'withValue'
        });

        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.find('ChildrenSection').props().canAutomaticallyOrder).toBeFalsy();
        expect(cmp.find('ChildrenSection').props().canManuallyOrder).toBeTruthy();
    });

    it('should have section with automatically and manually order', () => {
        setContext(context);
        setSectionContext(sectionContext);
        setFormikValues({
            'jmix:orderedList': false
        });

        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).dive().find('section');
        expect(cmp.find('ChildrenSection').props().canAutomaticallyOrder).toBeTruthy();
        expect(cmp.find('ChildrenSection').props().canManuallyOrder).toBeTruthy();
    });
});
