import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {MediaPicker} from './mediaPicker';

describe('mediaPicker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                data: {
                    value: 'imageid'
                },
                imageData: {
                    url: 'http://placekitten.com/g/200/300',
                    name: 'Beautiful_hairy_pussy.jpg',
                    size: [1532400, 1234134],
                    weight: 1.2,
                    type: 'Jpeg'
                }
            },
            id: 'yoloID'
        };
    });

    it('should display add image when field value is empty', () => {
        delete defaultProps.field.data.value;
        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();
        expect(cmp.find('MediaPickerEmpty').exists()).toBe(false);
    });

    it('should not display add image when field value is empty', () => {
        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();
        expect(cmp.find('MediaPickerEmpty').exists()).toBe(false);
    });

    it('should display the src from field', () => {
        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();
        expect(cmp.debug()).toContain(defaultProps.field.imageData.url);
    });

    it('should display the weight of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();
        expect(cmp.debug()).toContain(defaultProps.field.imageData.weight);
    });

    it('should display the type of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();
        expect(cmp.debug()).toContain(defaultProps.field.imageData.type);
    });

    it('should display the name of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();
        expect(cmp.debug()).toContain(defaultProps.field.imageData.name);
    });

    it('should display the size of image from field', () => {
        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive();
        expect(cmp.debug()).toContain(defaultProps.field.imageData.size[0]);
        expect(cmp.debug()).toContain(defaultProps.field.imageData.size[1]);
    });
});
