import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ImageList} from './ImageList';

describe('imageList', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            images: [{
                uuid: 'pathUuid',
                path: 'path1',
                url: 'url1',
                name: 'nameImg',
                width: '500',
                height: '800',
                type: 'jpeg'
            },
            {
                uuid: 'pathUuid2',
                path: 'path2',
                url: 'url2',
                name: 'nameImg2',
                width: '5002',
                height: '8002',
                type: 'jpeg2'
            }],
            isMultipleSelectable: true,
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

        expect(cmp.find('Card').length).toBe(2);
    });

    it('should the selected image when double click on it', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('Card').at(0).simulate('doubleClick');

        expect(defaultProps.onImageDoubleClick).toHaveBeenCalledWith(defaultProps.images[0]);
    });

    it('should return an array with the selected image when simple click', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('Card').at(0).simulate('click');

        expect(defaultProps.onImageSelection).toHaveBeenCalledWith([defaultProps.images[0]]);
    });

    it('should set image selected when simple click on it', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.find('Card').at(0).props().selected).toBe(false);

        cmp.find('Card').at(0).simulate('click');

        expect(cmp.find('Card').at(0).props().selected).toBe(true);
    });

    it('should set image unselected when simple click on it twice', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('Card').at(0).simulate('click');
        cmp.find('Card').at(0).simulate('click');

        expect(cmp.find('Card').at(0).props().selected).toBe(false);
    });

    it('should return an array with all selected images when simple click', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('Card').at(1).simulate('click');
        cmp.find('Card').at(0).simulate('click');

        expect(defaultProps.onImageSelection).toHaveBeenCalledWith([defaultProps.images[1], defaultProps.images[0]]);
    });

    it('should only select last image when multiple option is at false', () => {
        defaultProps.isMultipleSelectable = false;

        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();

        cmp.find('Card').at(1).simulate('click');
        cmp.find('Card').at(0).simulate('click');

        expect(defaultProps.onImageSelection).toHaveBeenCalledWith(defaultProps.images[0]);
    });

    it('should not display the image width and height if there is no', () => {
        defaultProps.images[0].width = null;
        defaultProps.images[0].height = null;

        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('Card')
            .at(0);

        expect(cmp.debug()).not.toContain('px');
    });

    it('should display the image width and height if there is', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('Card')
            .at(0);

        expect(cmp.debug()).toContain('jpeg - 500x800px');
    });

    it('should not select initially first image', () => {
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('Card')
            .at(0);

        expect(cmp.props().selected).toBe(false);
    });

    it('should select initially first image', () => {
        defaultProps.initialSelection = ['path1'];
        const cmp = shallowWithTheme(
            <ImageList {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('Card')
            .at(0);

        expect(cmp.props().selected).toBe(true);
    });
});
