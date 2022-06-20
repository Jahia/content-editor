import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {MainPanel} from './MainPanel';

describe('PickerDialog - MainPanel', () => {
    let props;
    beforeEach(() => {
        props = {
            pickerConfig: {
                PickerDialog: {
                    dialogTitle: 'yoloooooo',
                    DialogContent: 'DialogContent',
                    searchPlaceholder: 'searchPlaceholder',
                    view: 'List'
                }
            },
            nodeTreeConfigs: [{
                type: 'image'
            }],
            lang: 'fr',
            uilang: 'fr',
            selectedPath: '/selectedPath',
            setSelectedPath: jest.fn(),
            selectedItem: '/path/tata',
            setSelectedItem: jest.fn(),
            searchTerms: '',
            handleSearchChange: jest.fn(),
            onItemSelection: jest.fn(),
            onCloseDialog: jest.fn(),
            t: arg => arg
        };
    });

    it('should display the title set in the picker configuration', () => {
        const cmp = shallowWithTheme(
            <MainPanel {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain('yoloooooo');
    });
});
