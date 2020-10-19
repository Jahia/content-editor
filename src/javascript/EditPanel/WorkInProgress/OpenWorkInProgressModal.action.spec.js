import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {OpenWorkInProgressModal} from './OpenWorkInProgressModal.action';

jest.mock('react', () => {
    return {
        ...jest.requireActual('react'),
        useContext: jest.fn(() => ({}))
    };
});

describe('WorkInProgressDialog', () => {
    let defaultProps;
    let componentRenderer;
    beforeEach(() => {
        defaultProps = {
            siteInfo: {
                languages: ['fr', 'en']
            },
            language: 'fr',
            formik: {
                setFieldValue: () => jest.fn(),
                values: {
                    'WIP::Info': {}
                }
            },
            nodeData: {
                hasWritePermission: true,
                primaryNodeType:
                    {
                        name: 'jnt:content'
                    }
            },
            otherProps: true,
            render: () => ''
        };

        componentRenderer = {
            render: jest.fn()
        };
        React.useContext.mockImplementation(() => componentRenderer);
    });

    it('should be disbabled if no write permission', () => {
        defaultProps.nodeData.hasWritePermission = false;
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
        defaultProps.siteInfo.languages = ['fr'];
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
        defaultProps.nodeData.primaryNodeType.name = 'jnt:virtualsite';
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        ).find('render');

        expect(cmp.props().enabled).toBe(false);
    });
});
