import {showChipHeader, showChipField, getChipContent} from './WorkInProgress.utils';
import {useTranslation} from 'react-i18next';

describe('Work in progress Utils', () => {
    it('should showChipHeader returns true when status is not disabled', () => {
        const nodeData = {
            wipInfo: {
                status: 'ALL_CONTENT',
                languages: []
            }
        };
        expect(showChipHeader(nodeData)).toBe(true);
    });

    it('should showChipHeader returns false when status is disabled', () => {
        const nodeData = {
            wipInfo: {
                status: 'DISABLED',
                languages: []
            }
        };
        expect(showChipHeader(nodeData)).toBe(false);
    });

    it('should showChipHeader returns true when status is languages and has wip for current language', () => {
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['en', 'fr']
            }
        };
        expect(showChipHeader(nodeData, 'en')).toBe(true);
    });

    it('should showChipHeader returns false when status is languages and don\'t have wip for current language', () => {
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['en', 'fr']
            }
        };
        expect(showChipHeader(nodeData, 'de')).toBe(false);
    });

    it('should getChipContent returns label all content when status is all content', () => {
        const {t} = useTranslation();
        const nodeData = {
            wipInfo: {
                status: 'ALL_CONTENT',
                languages: []
            }
        };

        expect(getChipContent(nodeData, 'en', t)).toBe('translated_content-editor:label.contentEditor.edit.action.workInProgress.chipLabelAllContent');
    });

    it('should getChipContent returns label for languages when status is languages', () => {
        const {t} = useTranslation();
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['fr', 'en']
            }
        };

        expect(getChipContent(nodeData, 'en', t)).toBe('translated_content-editor:label.contentEditor.edit.action.workInProgress.chipLabelLanguagesEN');
    });

    it('should showChipField returns true when is i18n field and current language is wip', () => {
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['fr', 'en']
            }
        };

        expect(showChipField(true, nodeData, 'en')).toBe(true);
    });

    it('should showChipField returns false when is i18n field and current language is not wip', () => {
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['fr', 'en']
            }
        };

        expect(showChipField(true, nodeData, 'de')).toBe(false);
    });

    it('should showChipField returns false when is i18n field and wip status is not languages', () => {
        const nodeData = {
            wipInfo: {
                status: 'ALL_CONTENT',
                languages: []
            }
        };

        expect(showChipField(true, nodeData, 'en')).toBe(false);
    });

    it('should showChipField returns false when is not i18n field ', () => {
        const nodeData = {
            wipInfo: {
                status: 'LANGUAGES',
                languages: ['fr', 'en']
            }
        };

        expect(showChipField(false, nodeData, 'en')).toBe(false);
    });
});
