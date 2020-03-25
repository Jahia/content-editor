import {WipInfoChip} from './WipInfo.Chip';
import {showChipHeader} from '~/EditPanel/WorkInProgress/WorkInProgress.utils';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => {
            return {
                lang: 'en',
                nodeData: {
                    wipInfo: {
                        status: 'LANGUAGES',
                        languages: ['fr', 'en']
                    }
                }
            };
        }
    };
});

jest.mock('~/EditPanel/WorkInProgress/WorkInProgress.utils', () => {
    return {
        getChipContent: jest.fn(),
        showChipHeader: jest.fn()
    };
});

describe('WipInfoChip', () => {
    let showChip = true;

    beforeEach(() => {
        showChipHeader.mockImplementation(() => showChip);
    });

    it('Should display chip when showChipHeader is true', () => {
        let wrapper = shallow(<WipInfoChip/>);
        expect(wrapper.debug()).toContain('Chip');
    });

    it('Should display chip when showChipHeader is false', () => {
        showChip = false;
        let wrapper = shallow(<WipInfoChip/>);
        expect(wrapper.debug()).not.toContain('Chip');
    });
});
