import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {ImageCard} from './ImageCard';

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
            },
            onDoubleClick: jest.fn(),
            onClick: jest.fn()
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

    it('should not display the image width and height if there is no', () => {
        defaultProps.image.width = null;
        defaultProps.image.height = null;

        const cmp = shallowWithTheme(
            <ImageCard {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.debug()).not.toContain('px');
    });

    it('should call onDoubleClick when double clicking on the the card', () => {
        const cmp = shallowWithTheme(
            <ImageCard {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.simulate('doubleClick');

        expect(defaultProps.onDoubleClick).toHaveBeenCalled();
    });

    it('should call onClick when simple clicking on the the card', () => {
        const cmp = shallowWithTheme(
            <ImageCard {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.simulate('click');

        expect(defaultProps.onClick).toHaveBeenCalled();
    });
});
