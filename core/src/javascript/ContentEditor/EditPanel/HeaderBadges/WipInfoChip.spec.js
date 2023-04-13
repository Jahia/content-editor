import {getChipContent, showChipHeader, WipInfoChip} from './WipInfoChip';
import React from 'react';
import {shallow} from '@jahia/test-framework';
import {useTranslation} from 'react-i18next';

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => {
            return {
                lang: 'en'
            };
        }
    };
});

const field = {
    value: {
        status: 'LANGUAGES',
        languages:
            ['fr', 'en']
    }
};

describe('WipInfoChip', () => {
    it('Should display chip when showChipHeader is true', () => {
        const RenderWrapper = shallow(<WipInfoChip/>)
            .find('Field')
            .renderProp('children')({field});

        expect(RenderWrapper.debug()).toContain('Chip');
    });

    it('Should not display chip when showChipHeader is false', () => {
        field.value.languages = [];
        const RenderWrapper = shallow(<WipInfoChip/>)
            .find('Field')
            .renderProp('children')({field});

        expect(RenderWrapper.debug()).not.toContain('Chip');
    });
});

describe('Work in progress Utils', () => {
    it('should showChipHeader returns true when status is not disabled', () => {
        const nodeData = {
            wipInfo: {
                status: 'ALL_CONTENT',
                languages: []
            },
            defaultWipInfo: {status: 'DISABLED', languages: []}
        };
        expect(showChipHeader(nodeData.wipInfo)).toBe(true);
    });

    it('should showChipHeader returns false when status is disabled', () => {
        const nodeData = {
            wipInfo: {
                status: 'DISABLED',
                languages: []
            },
            defaultWipInfo: {status: 'DISABLED', languages: []}
        };
        expect(showChipHeader(nodeData.wipInfo)).toBe(false);
    });

    it('should showChipHeader returns true when status is languages and has wip for current language', () => {
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['en', 'fr']
            },
            defaultWipInfo: {status: 'DISABLED', languages: []}
        };
        expect(showChipHeader(nodeData.wipInfo, 'en')).toBe(true);
    });

    it('should showChipHeader returns false when status is languages and don\'t have wip for current language', () => {
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['en', 'fr']
            },
            defaultWipInfo: {status: 'DISABLED', languages: []}
        };
        expect(showChipHeader(nodeData.wipInfo, 'de')).toBe(false);
    });

    it('should getChipContent returns label all content when status is all content', () => {
        const {t} = useTranslation('content-editor');
        const nodeData = {
            wipInfo: {
                status: 'ALL_CONTENT',
                languages: []
            },
            defaultWipInfo: {status: 'DISABLED', languages: []}
        };

        expect(getChipContent(nodeData.wipInfo, 'en', t)).toBe('translated_content-editor:label.contentEditor.edit.action.workInProgress.chipLabelAllContent');
    });

    it('should getChipContent returns label for languages when status is languages', () => {
        const {t} = useTranslation('content-editor');
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['fr', 'en']
            },
            defaultWipInfo: {status: 'DISABLED', languages: []}
        };

        expect(getChipContent(nodeData.wipInfo, 'en', t)).toBe('translated_content-editor:label.contentEditor.edit.action.workInProgress.chipLabelLanguagesEN');
    });
});
