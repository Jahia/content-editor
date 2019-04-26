import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {ImageCard} from './image-card';

describe('imageCard', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            image: {
                path: 'pathImg',
                name: 'nameImg',
                width: '500',
                height: '800',
                type: 'jpeg'
            }
        };
    });

    it('should display the image name', () => {
        const cmp = shallowWithTheme(
            <ImageCard {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.debug()).toContain(defaultProps.image.name);
    });

    it('should display the image path', () => {
        const cmp = shallowWithTheme(
            <ImageCard {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.debug()).toContain(defaultProps.image.path);
    });

    it('should display the image type', () => {
        const cmp = shallowWithTheme(
            <ImageCard {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.debug()).toContain(defaultProps.image.type);
    });

    it('should display the image width and height', () => {
        const cmp = shallowWithTheme(
            <ImageCard {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.debug()).toContain('500');
        expect(cmp.debug()).toContain('800');
    });
});
