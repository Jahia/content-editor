import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {MediaPickerEmpty} from './MediaPickerEmpty';

describe('mediaPickerEmpty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            id: 'idInput',
            editorContext: {
                site: 'mySite',
                lang: 'en'
            },
            field: {
                displayName: 'x',
                name: 'x',
                readOnly: false,
                selectorType: 'MediaPicker'
            },
            formik: {},
            setActionContext: () => {}
        };
    });

    it('should display the fieldPickerEmpty', () => {
        const cmp = shallowWithTheme(
            <MediaPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(FieldPickerEmptyCmp)').exists();
    });
});
