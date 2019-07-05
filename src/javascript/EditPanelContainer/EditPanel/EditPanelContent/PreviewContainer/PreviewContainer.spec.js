import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {PreviewContainer} from './PreviewContainer';

jest.mock('formik', () => {
    let formikvaluemock;

    return {
        setFormikValue: value => {
            formikvaluemock = value;
        },
        connect: Cmp => props => (
            <Cmp {...props} formik={{dirty: formikvaluemock}}/>
        )
    };
});

import {setFormikValue} from 'formik';

jest.mock('../../../ContentEditor.context', () => ({
    useContentEditorContext: () => ({
        path: '/site/digitall',
        lang: 'fr'
    })
}));

describe('PreviewContainer', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            editorContext: {
                path: '',
                language: 'en',
                lang: 'fr'
            },
            t: jest.fn(),
            classes: {}
        };

        setFormikValue(false);
    });

    it('should display content preview', () => {
        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive()
            .dive();

        cmp.find('ContentPreview').exists();
    });

    it('should display the badge preview update on save when content is updated', () => {
        setFormikValue(true);

        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive()
            .dive();

        expect(cmp.find('DsBadge').exists()).toBe(true);
    });

    it('should hide the badge preview update on save when content is not updated', () => {
        const cmp = shallowWithTheme(
            <PreviewContainer {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive()
            .dive();

        expect(cmp.find('DsBadge').exists()).toBe(false);
    });
});
