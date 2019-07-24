import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {FieldSet} from './FieldSet';

describe('Section component', () => {
    let props;

    beforeEach(() => {
        props = {
            fieldset: {displayName: 'FieldSet1'}
        };
    });

    it('should display FieldSet name', () => {
        const cmp = shallowWithTheme(<FieldSet {...props}/>, {}, dsGenericTheme).dive();

        expect(cmp.debug()).toContain(props.fieldset.displayName);
    });
});
