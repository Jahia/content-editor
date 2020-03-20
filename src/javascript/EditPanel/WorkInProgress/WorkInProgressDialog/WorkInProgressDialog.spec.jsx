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

describe('CopyLanguageDialog', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            isOpen: false,
            isWipContent: false,
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
        const cmp = shallowWithTheme(
            <WorkInProgressDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find({checked: defaultProps.isWipContent}).exists()).toBe(true);
        expect(cmp.find({checked: !defaultProps.isWipContent}).exists()).toBe(false);
    });
});
