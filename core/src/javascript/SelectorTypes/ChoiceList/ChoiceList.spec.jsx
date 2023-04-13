import React from 'react';
import {shallow} from '@jahia/test-framework';

import {ChoiceList} from './ChoiceList';

describe('ChoiceList component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'MultipleSelect1',
            field: {
                name: 'myOption',
                displayName: 'myOption',
                valueConstraints: [{
                    displayValue: 'yoloooFR',
                    value: {
                        string: 'Yolooo'
                    }
                }],
                selectorType: 'MultipleSelect',
                readOnly: false
            },
            setActionContext: jest.fn()
        };
    });

    it('should display MultipleSelect when multiple value can be selected', () => {
        props.field.multiple = true;
        const cmp = shallow(<ChoiceList {...props}/>);

        expect(cmp.find('MultipleSelect').exists()).toBe(true);
    });

    it('should display SingleChoiceList when only one value can be selected', () => {
        const cmp = shallow(<ChoiceList {...props}/>);

        expect(cmp.find('SingleSelect').exists()).toBe(true);
    });
});
