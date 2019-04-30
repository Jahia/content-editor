import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {ImageList} from './ImageList';

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
            }],
            onImageDoubleClick: jest.fn()
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

    it('should return an array with the selected image when double', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('WithStyles(ImageCardCmp)').at(0).simulate('doubleClick');

        expect(defaultProps.onImageDoubleClick).toHaveBeenCalledWith(defaultProps.images[0]);
    });
});
