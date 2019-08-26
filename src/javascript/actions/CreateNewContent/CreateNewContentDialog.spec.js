import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {CreateNewContentDialog} from './CreateNewContentDialog';

jest.mock('react-apollo', () => ({
    withApollo: Cmp => props => (<Cmp {...props} client={{}}/>),
    compose: jest.requireActual('react-apollo').compose
}));

jest.mock('./CreateNewContent.adapter', () => {
    return {
        useTreeOfNewContent: () => ({})
    };
});

describe('CreateNewContentDialog', () => {
    it('should display the dialog by default', () => {
        const cmp = shallowWithTheme(
            <CreateNewContentDialog open onClose={() => {}} onExited={() => {}}/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('should close the dialog when click on the cancel button', () => {
        let open = true;
        const cmp = shallowWithTheme(
            <CreateNewContentDialog open={open}
                                    onClose={() => {
                                        open = false;
                                    }}
                                    onExited={() => {
                                        open = false;
                                    }}/>,
            {},
            dsGenericTheme
        ).dive().dive().dive();

        cmp.find('DsButton').at(0).simulate('click');

        expect(open).toBe(false);
    });
});
