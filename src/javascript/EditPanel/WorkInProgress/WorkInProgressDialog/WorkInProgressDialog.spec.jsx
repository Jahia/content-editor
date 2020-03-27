import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {WorkInProgressDialog} from './';

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
            isOpen: false,
            wipInfo: {wipStatus: 'DISABLED', languages: []},
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

    it('should checkbox not be checked when isWipContent is false', () => {

        // TODO rewrite test BACKLOG-13001
        // const cmp = shallowWithTheme(
        //     <WorkInProgressDialog {...defaultProps}/>,
        //     {},
        //     dsGenericTheme
        // ).dive();
        //
        // expect(cmp.find({checked: false}).exists()).toBe(true);
        // expect(cmp.find({checked: true}).exists()).toBe(false);
    });

    it('should radio button be displayed when have multiple languages', () => {
        // TODO rewrite test BACKLOG-13001
        // const cmp = shallowWithTheme(
        //     <WorkInProgressDialog {...defaultProps}/>,
        //     {},
        //     dsGenericTheme
        // ).dive();
        //
        // expect(cmp.find({value: 'LANGUAGES'}).exists()).toBe(true);
        // expect(cmp.find({value: 'ALL_CONTENT'}).exists()).toBe(true);
    });
    it('should radio button not be displayed when there is only one language', () => {
        defaultProps.languages.splice(0, 1);
        const cmp = shallowWithTheme(
            <WorkInProgressDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find({value: 'localizedProperties'}).exists()).toBe(false);
        expect(cmp.find({value: 'allContent'}).exists()).toBe(false);
    });
});
