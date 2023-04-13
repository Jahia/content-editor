import {TechnicalInformation} from './TechnicalInformation';
import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {details, technicalInfo} from '~/contexts';

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => {
    const details = [{
        label: 'Creator',
        value: 'root'}];
    const technicalInfo = [{
        label: 'UUID',
        value: '16f485de-dd51-4ebb-b34a-2cd0327b1317'}];
    return {
        useContentEditorContext: () => ({details, technicalInfo}),
        details,
        technicalInfo
    };
});

describe('TechnicalInformation', () => {
    it('should not throw error', () => {
        shallowWithTheme(<TechnicalInformation/>, {}, dsGenericTheme);
    });

    it('should contain an InfoPanel for details', () => {
        const cmp = shallowWithTheme(<TechnicalInformation/>, {}, dsGenericTheme);

        expect(cmp.find({infos: details}).exists()).toBe(true);
    });

    it('should contain an InfoPanel for technicalInfo', () => {
        const cmp = shallowWithTheme(<TechnicalInformation/>, {}, dsGenericTheme);

        expect(cmp.find({infos: technicalInfo}).exists()).toBe(true);
    });
});
