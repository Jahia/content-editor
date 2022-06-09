import {WipInfoChip} from './WipInfo.Chip';
import {showChipHeader} from '~/EditPanel/WorkInProgress/WorkInProgress.utils';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorContext: () => {
            return {
                lang: 'en'
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
const field = {
    value: {
        wipInfo: {
            status: 'LANGUAGES',
            languages:
                ['fr', 'en']
        }
    }
};
describe('WipInfoChip', () => {
    let showChip = true;

    beforeEach(() => {
        showChipHeader.mockImplementation(() => showChip);
    });

    it('Should display chip when showChipHeader is true', () => {
        const RenderWrapper = shallow(<WipInfoChip/>)
            .find('Field')
            .renderProp('children')({field});

        expect(RenderWrapper.debug()).toContain('Chip');
    });

    it('Should display chip when showChipHeader is false', () => {
        showChip = false;

        const RenderWrapper = shallow(<WipInfoChip/>)
            .find('Field')
            .renderProp('children')({field});

        expect(RenderWrapper.debug()).not.toContain('Chip');
    });
});
