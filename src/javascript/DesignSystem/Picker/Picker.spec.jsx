import React from 'react';

import ImageIcon from '@material-ui/icons/Image';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {Picker} from './Picker';

describe('picker empty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            emptyLabel: 'totoprops',
            emptyIcon: <ImageIcon/>,
            onClick: jest.fn(),
            children: '',
            classes: {}
        };
    });

    it('should display the label', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(defaultProps.emptyLabel);
    });

    it('should emmit onClick', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('button').simulate('click');

        expect(defaultProps.onClick).toHaveBeenCalled();
    });

    it('should not set trigger onClick when clicking on the button when readOnly', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps} readOnly/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('button').simulate('click');

        expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
});

describe('picker filled', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {},
            fieldData: {
                url: 'iconUrl',
                name: 'name part',
                info: 'info part'
            },
            id: 'yoloID'
        };

        window.contextJsParameters = {
            contextPath: ''
        };
    });

    it('should display the url from field data', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('img').props().src).toContain(
            defaultProps.fieldData.url
        );
    });

    it('should display the name part from field data', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(defaultProps.fieldData.name);
    });

    it('should display the info part from field data', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmp.debug()).toContain(defaultProps.fieldData.info);
    });

    it('should be in read only', () => {
        defaultProps.readOnly = true;
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmp.props().className).toContain('fieldContainerReadOnly');
    });

    it('should NOT be in read only', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmp.props().className).not.toContain('fieldContainerReadOnly');
    });

    it('should send onClick event when clicking on the component', () => {
        defaultProps.onClick = jest.fn();
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.simulate('click');

        expect(defaultProps.onClick).toHaveBeenCalled();
    });
});
