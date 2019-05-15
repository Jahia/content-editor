import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {TextArea} from './TextArea';

describe('imageList', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            value: 'uuidValue',
            classNames: {
                container: 'IwantToStyleContainer',
                textarea: 'IwantToStyleTextarea'
            }
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

    it('should bind the className to the textarea', () => {
        const cmp = shallowWithTheme(
            <TextArea {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('textarea');

        expect(cmp.props().className).toContain(
            defaultProps.classNames.textarea
        );
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

    it('it should set aria-invalid to the textarea when field is in error', () => {
        defaultProps.error = true;
        const cmp = shallowWithTheme(
            <TextArea {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('textarea');

        expect(cmp.props()['aria-invalid']).toBe(true);
    });
});
