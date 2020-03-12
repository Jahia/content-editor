import {LockInfoBadge} from './LockInfo.badge';
import React from 'react';
import {shallow} from '@jahia/test-framework';

jest.mock('~/ContentEditor.context', () => {
    let lockedAndCannotBeEdited = false;
    return {
        useContentEditorContext: () => {
            lockedAndCannotBeEdited = !lockedAndCannotBeEdited;
            return {
                nodeData: {
                    lockedAndCannotBeEdited: lockedAndCannotBeEdited,
                    lockInfo: {
                        details: [{
                            type: 'user',
                            owner: 'root'
                        }]
                    }
                }
            };
        }
    };
});

describe('LockInfoBadge.badge', () => {
    it('Should display badge when lockedAndCannotBeEdited is true', () => {
        let wrapper = shallow(<LockInfoBadge/>);
        expect(wrapper.debug()).toContain('Chip');
    });

    it('Should not display badge when lockedAndCannotBeEdited is false', () => {
        let wrapper = shallow(<LockInfoBadge/>);
        expect(wrapper.debug()).not.toContain('Chip');
    });
});
