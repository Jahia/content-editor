import React from 'react';

import {Image} from '@jahia/moonstone';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ReferenceCard} from './ReferenceCard';

describe('reference card empty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            emptyLabel: 'totoprops',
            emptyIcon: <Image/>,
            onClick: jest.fn(),
            classes: {}
        };
    });

    it('should display the label', () => {
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(defaultProps.emptyLabel);
    });

    it('should emmit onClick', () => {
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('button').simulate('click');

        expect(defaultProps.onClick).toHaveBeenCalled();
    });

    it('should not set trigger onClick when clicking on the button when isReadOnly', () => {
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps} isReadOnly/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('button').simulate('click');

        expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
});

describe('reference card filled', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {},
            fieldData: {
                url: 'iconUrl',
                name: 'name part',
                info: 'info part'
            },
            id: 'yoloID',
            isDraggable: false
        };

        window.contextJsParameters = {
            contextPath: ''
        };
    });

    it('should display the url from field data', () => {
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('img').props().src).toContain(
            defaultProps.fieldData.url
        );
    });

    it('should display the name part from field data', () => {
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(defaultProps.fieldData.name);
    });

    it('should display the info part from field data', () => {
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmp.debug()).toContain(defaultProps.fieldData.info);
    });

    it('should be in read only', () => {
        defaultProps.isReadOnly = true;
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmp.find('article').props().className).toContain('fieldContainerReadOnly');
    });

    it('should NOT be in read only', () => {
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmp.find('article').props().className).not.toContain('fieldContainerReadOnly');
    });

    it('should send onClick event when clicking on the component', () => {
        defaultProps.onClick = jest.fn();
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('article').simulate('click');

        expect(defaultProps.onClick).toHaveBeenCalled();
    });

    it('should not send onClick event when clicking on isReadOnly component', () => {
        defaultProps.onClick = jest.fn();
        defaultProps.isReadOnly = true;
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('article').simulate('click');

        expect(defaultProps.onClick).not.toHaveBeenCalled();
    });

    it('should not contain draggable icon', () => {
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('SvgHandleDrag').exists()).toBeFalsy();
    });

    it('should contain draggable icon', () => {
        defaultProps.isDraggable = true;
        const cmp = shallowWithTheme(
            <ReferenceCard {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('SvgHandleDrag').exists()).toBeTruthy();
    });
});
