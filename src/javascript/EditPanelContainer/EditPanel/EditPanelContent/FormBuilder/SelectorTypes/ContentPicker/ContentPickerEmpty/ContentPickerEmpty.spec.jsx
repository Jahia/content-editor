import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {ContentPickerEmpty} from './ContentPickerEmpty';

describe('contentPickerEmpty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            id: 'idInput',
            editorContext: {
                site: 'mySite',
                lang: 'en'
            },
            field: {
                formDefinition: {
                    readOnly: false
                }
            },
            formik: {}
        };
    });

    it('should display the fieldPickerEmpty', () => {
        const cmp = shallowWithTheme(
            <ContentPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('WithStyles(FieldPickerEmptyCmp)').exists();
    });
});
