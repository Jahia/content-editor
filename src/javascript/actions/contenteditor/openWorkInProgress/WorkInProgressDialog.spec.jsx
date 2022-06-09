import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {WorkInProgressDialog} from './WorkInProgressDialog';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock = {
        client: {
            query: () => {
                return [];
            }
        }
    };
    return {
        useApolloClient: () => queryresponsemock
    };
});

describe('WorkInProgressDialog', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            language: 'en',
            isOpen: false,
            wipInfo: {status: 'DISABLED', languages: []},
            languages: [{
                displayName: 'Deutsch',
                language: 'de',
                activeInEdit: true
            },
            {
                displayName: 'English',
                language: 'en',
                activeInEdit: true
            }],
            onCloseDialog: () => {},
            onApply: () => {}
        };
        window.contextJsParameters = {
            config: {
                academyLink: 'https://academy.jahia.com/documentation/digital-experience-manager/8.0/functional/how-to-contribute-content#Work_in_Progress'
            }
        };
    });

    it('should hide dialog when open is false', () => {
        const cmp = shallowWithTheme(
            <WorkInProgressDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(false);
    });

    it('should show dialog when open is true', () => {
        defaultProps.isOpen = true;
        const cmp = shallowWithTheme(
            <WorkInProgressDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(true);
    });

    it('should checked WIP checkbox when wipInfo.status is not disabled', () => {
        defaultProps.wipInfo.status = 'ALL_CONTENT';
        const cmp = shallowWithTheme(
            <WorkInProgressDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const checkbox = cmp.find({'data-sel-role': 'WIP'});

        expect(checkbox.props().checked).toBe(true);
    });

    it('should not checked WIP checkbox when wipInfo.status is disabled', () => {
        const cmp = shallowWithTheme(
            <WorkInProgressDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const checkbox = cmp.find({'data-sel-role': 'WIP'});

        expect(checkbox.props().checked).toBe(false);
    });

    it('should languages and current displayed when WIP enabled', () => {
        defaultProps.wipInfo.status = 'ALL_CONTENT';
        const cmp = shallowWithTheme(
            <WorkInProgressDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find({value: 'LANGUAGES'}).exists()).toBe(true);
        expect(cmp.find({value: 'ALL_CONTENT'}).exists()).toBe(true);
    });
    it('should languages and current displayed when WIP disabled', () => {
        defaultProps.languages.splice(0, 1);
        const cmp = shallowWithTheme(
            <WorkInProgressDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find({value: 'LANGUAGES'}).exists()).toBe(false);
        expect(cmp.find({value: 'ALL_CONTENT'}).exists()).toBe(false);
    });
});
