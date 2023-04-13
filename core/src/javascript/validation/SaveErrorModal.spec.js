import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {SaveErrorModal} from './SaveErrorModal';

describe('SaveErrorModal', () => {
    let props;
    beforeEach(() => {
        props = {
            onClose: jest.fn(),
            onCreateContent: jest.fn(),
            i18nErrors: {
                shared: {
                    field1: 'required',
                    field2: 'required',
                    field3: 'required'
                }
            },
            siteInfo: {
                languages: [
                    {name: 'en', displayName: 'English'}
                ]
            },
            fields: [
                {name: 'field1'},
                {name: 'field2'},
                {name: 'field3'}
            ]
        };
    });

    it('should display the dialog by default', () => {
        const cmp = shallowWithTheme(
            <SaveErrorModal {...props} open/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('should close the dialog when click on the cancel button', () => {
        let open = true;
        const cmp = shallowWithTheme(
            <SaveErrorModal {...props}
                            open={open}
                            onClose={() => {
                                open = false;
                            }}
            />,
            {},
            dsGenericTheme
        );

        cmp.find('Button').at(0).simulate('click');

        expect(open).toBe(false);
    });
});
