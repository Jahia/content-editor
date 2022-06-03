import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {Card} from './Card';

describe('Card', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            image: {
                src: 'pathImg',
                alt: 'nameImg'
            },
            headerText: 'title',
            subhead: 'subhead',
            onDoubleClick: jest.fn(),
            onClick: jest.fn()
        };
    });

    it('should display the image src', () => {
        const cmp = shallowWithTheme(
            <Card {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(defaultProps.image.src);
    });

    it('should display the image type', () => {
        const cmp = shallowWithTheme(
            <Card {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(defaultProps.image.alt);
    });

    it('should display the headerText', () => {
        const cmp = shallowWithTheme(
            <Card {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(defaultProps.headerText);
    });

    it('should display the subhead', () => {
        const cmp = shallowWithTheme(
            <Card {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(defaultProps.subhead);
    });

    it('should call onDoubleClick when double clicking on the the card', () => {
        const cmp = shallowWithTheme(
            <Card {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.simulate('doubleClick');

        expect(defaultProps.onDoubleClick).toHaveBeenCalled();
    });

    it('should call onClick when simple clicking on the the card', () => {
        const cmp = shallowWithTheme(
            <Card {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.simulate('click');

        expect(defaultProps.onClick).toHaveBeenCalled();
    });
});
