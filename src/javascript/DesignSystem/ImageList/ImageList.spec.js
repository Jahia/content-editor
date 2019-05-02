import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {ImageList} from './ImageList';

describe('imageList', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            images: [{
                uuid: 'pathUuid',
                name: 'nameImg',
                width: '500',
                height: '800',
                type: 'jpeg'
            },
            {
                uuid: 'pathUuid2',
                name: 'nameImg2',
                width: '5002',
                height: '8002',
                type: 'jpeg2'
            }],
            multipleSelectable: true,
            onImageDoubleClick: jest.fn(),
            onImageSelection: jest.fn()
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

    it('should the selected image when double click on it', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('WithStyles(ImageCardCmp)').at(0).simulate('doubleClick');

        expect(defaultProps.onImageDoubleClick).toHaveBeenCalledWith(defaultProps.images[0]);
    });

    it('should return an array with the selected image when simple click', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('WithStyles(ImageCardCmp)').at(0).simulate('click');

        expect(defaultProps.onImageSelection).toHaveBeenCalledWith([defaultProps.images[0]]);
    });

    it('should set image selected when simple click on it', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.find('WithStyles(ImageCardCmp)').at(0).props().selected).toBe(false);

        cmp.find('WithStyles(ImageCardCmp)').at(0).simulate('click');

        expect(cmp.find('WithStyles(ImageCardCmp)').at(0).props().selected).toBe(true);
    });

    it('should set image unselected when simple click on it twice', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('WithStyles(ImageCardCmp)').at(0).simulate('click');
        cmp.find('WithStyles(ImageCardCmp)').at(0).simulate('click');

        expect(cmp.find('WithStyles(ImageCardCmp)').at(0).props().selected).toBe(false);
    });

    it('should return an array with all selected images when simple click', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('WithStyles(ImageCardCmp)').at(1).simulate('click');
        cmp.find('WithStyles(ImageCardCmp)').at(0).simulate('click');

        expect(defaultProps.onImageSelection).toHaveBeenCalledWith([defaultProps.images[1], defaultProps.images[0]]);
    });

    it('should only select last image when multiple option is at false', () => {
        defaultProps.multipleSelectable = false;

        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('WithStyles(ImageCardCmp)').at(1).simulate('click');
        cmp.find('WithStyles(ImageCardCmp)').at(0).simulate('click');

        expect(defaultProps.onImageSelection).toHaveBeenCalledWith([defaultProps.images[0]]);
    });
});
