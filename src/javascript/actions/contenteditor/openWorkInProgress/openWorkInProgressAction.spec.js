import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {OpenWorkInProgressModal} from './openWorkInProgressAction';
import {useFormikContext} from 'formik';
import {useContentEditorContext} from '~/contexts/ContentEditor';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useContext: jest.fn(() => ({}))
    };
});
jest.mock('formik');
jest.mock('~/contexts/ContentEditor/ContentEditor.context');

describe('WorkInProgressDialog', () => {
    let defaultProps;
    let formik;
    let contentEditorContext;
    let componentRenderer;
    beforeEach(() => {
        defaultProps = {
            otherProps: true,
            render: () => ''
        };

        formik = {
            setFieldValue: () => jest.fn(),
            values: {
                'WIP::Info': {}
            }
        };

        useFormikContext.mockReturnValue(formik);
        contentEditorContext = {
            siteInfo: {
                languages: ['fr', 'en']
            },
            lang: 'fr',
            nodeData: {
                hasWritePermission: true,
                primaryNodeType:
                    {
                        name: 'jnt:content'
                    }
            }
        };
        useContentEditorContext.mockReturnValue(contentEditorContext);

        componentRenderer = {
            render: jest.fn()
        };
        React.useContext.mockImplementation(() => componentRenderer);
    });

    it('should be disbabled if no write permission', () => {
        contentEditorContext.nodeData.hasWritePermission = false;
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('render').props().enabled).toBe(false);
    });

    it('should pass otherProps to the render component', () => {
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('render').props().otherProps).toBe(true);
    });

    it('should display WIP modal when there is more than one language', () => {
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        ).find('render');

        cmp.props().onClick();

        expect(componentRenderer.render).toHaveBeenCalled();
    });

    it('should not display WIP modal when there is only one language', () => {
        contentEditorContext.siteInfo.languages = ['fr'];
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        ).find('render');

        cmp.props().onClick();

        expect(componentRenderer.render).not.toHaveBeenCalled();
    });

    it('should not enabled WIP when is not virtual site node', () => {
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        ).find('render');

        expect(cmp.props().enabled).toBe(true);
    });

    it('should not enabled WIP when is virtual site node type', () => {
        contentEditorContext.nodeData.primaryNodeType.name = 'jnt:virtualsite';
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        ).find('render');

        expect(cmp.props().enabled).toBe(false);
    });
});
