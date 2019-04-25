import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {Modal} from './modal';

jest.mock('./modal.gql-queries', () => {
    return {
        useImagesData: () => ({
            images: [],
            loading: false,
            error: null
        })
    };
});

describe('mediaPicker modal', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            idInput: 'IDdd',
            onCloseDialog: jest.fn()
        };
    });

    it('should close the modal when click on Cancel button', () => {
        const cmp = shallowWithTheme(
            <Modal {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('WithStyles(Button)[color="secondary"]').simulate('click');

        expect(defaultProps.onCloseDialog).toHaveBeenCalled();
    });
});
