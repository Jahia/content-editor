import {LockInfoChip, getBadgeContent} from './LockInfoChip';
import React from 'react';
import {shallow} from '@jahia/test-framework';
import {useTranslation} from 'react-i18next';

jest.mock('~/contexts/ContentEditor/ContentEditor.context', () => {
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
        let wrapper = shallow(<LockInfoChip/>);
        expect(wrapper.debug()).toContain('Chip');
    });

    it('Should not display badge when lockedAndCannotBeEdited is false', () => {
        let wrapper = shallow(<LockInfoChip/>);
        expect(wrapper.debug()).not.toContain('Chip');
    });
});

describe('Lock Utils', () => {
    it('test getBadgeContent', () => {
        const {t} = useTranslation('content-editor');
        const nodeDataLockUser = {
            input: {
                lockedAndCannotBeEdited: true,
                lockInfo: {
                    details: [{
                        type: 'user',
                        owner: 'root'
                    }]
                }
            },
            expected: 'translated_content-editor:label.contentEditor.edit.action.lock.user'
        };

        const nodeDataLockWithWorkFlowLock = {
            input: {
                lockedAndCannotBeEdited: true,
                lockInfo: {
                    details: [{
                        type: 'user',
                        owner: 'root'
                    }, {
                        type: 'validation',
                        owner: 'root'
                    }]
                }
            },
            expected: 'translated_content-editor:label.contentEditor.edit.action.lock.validation'
        };

        const nodeDataUnknownLock = {
            input: {
                lockedAndCannotBeEdited: true,
                lockInfo: {
                    details: [{
                        type: 'customLock',
                        owner: 'root'
                    }]
                }
            },
            expected: 'translated_content-editor:label.contentEditor.edit.action.lock.unknown'
        };

        const nodeDataDeletion = {
            input: {
                lockedAndCannotBeEdited: true,
                lockInfo: {
                    details: [{
                        type: 'deletion',
                        owner: 'root'
                    }]
                }
            },
            expected: 'translated_content-editor:label.contentEditor.edit.action.lock.deletion'
        };

        [nodeDataLockUser, nodeDataLockWithWorkFlowLock, nodeDataUnknownLock, nodeDataDeletion].forEach(
            test => {
                expect(getBadgeContent(test.input, t)).toEqual(test.expected);
            }
        );
    });
});
