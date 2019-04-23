import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {Modal} from './modal';

describe('mediaPicker modal', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {};
    });

    it('should just work', () => {
        const cmp = shallowWithTheme(
            <Modal {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp).toBeTruthy();
    });
});
