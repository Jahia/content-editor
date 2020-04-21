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
            context: {
                siteInfo: {
                    languages: ['fr', 'en']
                },
                formik: {
                    setFieldValue: () => jest.fn(),
                    values: {
                        'WIP::Info': {}
                    }
                },
                nodeData: {
                    hasWritePermission: true
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
        defaultProps.context.nodeData.hasWritePermission = false;
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('render').props().context.enabled).toBe(false);
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

        cmp.props().context.onClick();

        expect(componentRenderer.render).toHaveBeenCalled();
    });

    it('should not display WIP modal when there is only one language', () => {
        defaultProps.context.siteInfo.languages = ['fr'];
        const cmp = shallowWithTheme(
            <OpenWorkInProgressModal {...defaultProps}/>,
            {},
            dsGenericTheme
        ).find('render');

        cmp.props().context.onClick();

        expect(componentRenderer.render).not.toHaveBeenCalled();
    });
});
