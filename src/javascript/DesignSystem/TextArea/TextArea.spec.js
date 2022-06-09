import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {TextArea} from './TextArea';

describe('TextArea', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            value: 'uuidValue'
        };
    });

    it('should display the value of the component', () => {
        const cmp = shallowWithTheme(
            <TextArea {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('textarea');

        expect(cmp.debug()).toContain('uuidValue');
    });

    it('it should have 5 rows by default', () => {
        const cmp = shallowWithTheme(
            <TextArea {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('textarea');

        expect(cmp.props().rows).toBe(5);
    });

    it('it should bind rows props to textarea', () => {
        defaultProps.rows = 50;
        const cmp = shallowWithTheme(
            <TextArea {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('textarea');

        expect(cmp.props().rows).toBe(defaultProps.rows);
    });

    it('it should bind all props to textarea', () => {
        defaultProps['data-yolo'] = '42';
        const cmp = shallowWithTheme(
            <TextArea {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('textarea');

        expect(cmp.props()['data-yolo']).toBe('42');
    });

    it('it should disabled the textarea', () => {
        defaultProps.disabled = true;
        const cmp = shallowWithTheme(
            <TextArea {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('textarea');

        expect(cmp.props().disabled).toBe(true);
    });
});
