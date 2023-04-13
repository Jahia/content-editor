import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {InfoPanel} from './index';

describe('InfoPanel', () => {
    it('should display the panelTitle', () => {
        const cmp = shallowWithTheme(
            <InfoPanel panelTitle="thisIsATest"/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain('thisIsATest');
    });

    it('should display the infos', () => {
        const infos = [
            {label: 'label1', value: 'value1'},
            {label: 'label2', value: 'value2'},
            {label: 'label3', value: 'value3'}
        ];

        const cmp = shallowWithTheme(
            <InfoPanel infos={infos} panelTitle="thisIsATest2"/>,
            {},
            dsGenericTheme
        ).dive();

        const view = cmp.debug();

        infos.forEach(info => {
            expect(view).toContain(info.label);
            expect(view).toContain(info.value);
        });
    });
});
