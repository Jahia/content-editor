import {getBadgeContent} from './Lock.utils';
import {useTranslation} from 'react-i18next';

describe('Lock Utils', () => {
    it('test getBadgeContent', () => {
        const {t} = useTranslation();
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
