import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {DropdownTreeSelect} from './DropdownTreeSelect';

describe('DatePickerInput', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            disabled: true,
            readOnly: true,
            noMatchesLabel: 'a label oh',
            data: [
                {
                    label: 'VP Accounting',
                    checked: true,
                    children: [
                        {
                            label: 'iWay',
                            children: [
                                {label: 'Universidad de Especialidades del Espíritu Santo'},
                                {label: 'Marmara University'},
                                {label: 'Baghdad College of Pharmacy'}
                            ]
                        },
                        {
                            label: 'KDB',
                            children: [
                                {label: 'Latvian University of Agriculture'},
                                {label: 'Dublin Institute of Technology'}
                            ]
                        }
                    ]
                }
            ]
        };
    });

    it('should give the disabled props to OriginalDropdowTreeSelect component', () => {
        const cmp = shallowWithTheme(
            <DropdownTreeSelect {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().props().disabled).toBe(true);
    });

    it('should give the readonly props to OriginalDropdowTreeSelect component', () => {
        const cmp = shallowWithTheme(
            <DropdownTreeSelect {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().props().readOnly).toBe(true);
    });
});
