import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {Input} from './Input';

describe('Input', () => {
    const booleanProps = [
        {propName: 'readOnly', clazz: 'readOnly'},
        {propName: 'disabled', clazz: 'inputDisabled'},
        {propName: 'error', clazz: ''}
    ];

    booleanProps.forEach(prop => it(`should ${prop.propName} to be true on rendered component`, () => {
        const {propName, clazz} = prop;
        const props = [];
        props[propName] = true;
        const cmp = shallowWithTheme(
            <Input {...props}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        const cmpProps = cmp.props();
        expect(cmpProps[propName]).toBe(true);
        expect(cmpProps.className).toContain(clazz);
    }));
});
