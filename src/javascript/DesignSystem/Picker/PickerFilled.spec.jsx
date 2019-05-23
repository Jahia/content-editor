import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {PickerFilled} from './PickerFilled';

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
            <PickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('img').props().src).toContain(defaultProps.fieldData.url);
    });

    it('should display the name part from field data', () => {
        const cmp = shallowWithTheme(
            <PickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain(defaultProps.fieldData.name);
    });

    it('should display the info part from field data', () => {
        const cmp = shallowWithTheme(
            <PickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.debug()).toContain(defaultProps.fieldData.info);
    });

    it('should be in read only', () => {
        defaultProps.readOnly = true;
        const cmp = shallowWithTheme(
            <PickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.props().className).toContain('fieldContainerReadOnly');
    });

    it('should NOT be in read only', () => {
        const cmp = shallowWithTheme(
            <PickerFilled {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();
        expect(cmp.props().className).not.toContain('fieldContainerReadOnly');
    });
});
