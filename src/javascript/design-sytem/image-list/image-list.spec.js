import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {ImageList} from './image-list';

describe('imageCard', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            images: [{
                path: 'pathImg',
                name: 'nameImg',
                width: '500',
                height: '800',
                type: 'jpeg'
            },
            {
                path: 'pathImg2',
                name: 'nameImg2',
                width: '5002',
                height: '8002',
                type: 'jpeg2'
            }]
        };
    });

    it('should display an error with there is one', () => {
        defaultProps.error = new Error('yoooooloooooo');

        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.debug()).toContain('yoooooloooooo');
    });

    it('should display an imageCard per images', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.find('WithStyles(ImageCardCmp)').length).toBe(2);
    });
});
