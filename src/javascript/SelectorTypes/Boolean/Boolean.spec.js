import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {Boolean} from './Boolean';

describe('Checkbox component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'checkbox1',
            field: {
                displayName: 'myCheckbox',
                name: 'myCheckbox',
                readOnly: false,
                selectorType: 'ContentPicker'
            },
            classes: {},
            onChange: jest.fn()
        };
    });

    const buildComp = props => {
        return shallowWithTheme(<Boolean {...props}/>, {}, dsGenericTheme);
    };

    it('should display unchecked', () => {
        const checkboxCmp = buildComp(props);
        expect(checkboxCmp.dive().dive().find('input').props().checked).toBe(false);
    });

    it('should display checked', () => {
        props.value = true;
        const checkboxCmp = buildComp(props);
        expect(checkboxCmp.dive().dive().find('input').props().checked).toBe(true);
    });

    it('should change', () => {
        const checkboxCmp = buildComp(props);
        const innerCmp = checkboxCmp.dive().dive().find('input');
        innerCmp.simulate('change', null, true);
        expect(props.onChange).toHaveBeenCalledWith(true);
    });

    it('should change from false to true', () => {
        props.initialValue = false;
        const checkboxCmp = buildComp(props);
        const innerCmp = checkboxCmp.dive().dive().find('input');
        innerCmp.simulate('change', null, true);
        expect(props.onChange).toHaveBeenCalledWith(true);
    });

    it('should be readonly', () => {
        testReadOnly(true);
    });

    it('should not be readonly', () => {
        testReadOnly(false);
    });

    const testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;

        const checkboxCmp = buildComp(props);
        expect(checkboxCmp.props().isReadOnly).toBe(readOnly);
    };
});
