import {generateLockEditorId, getLockEditorId, resetLockEditorId} from './LockUtils';

describe('LockUtils', () => {
    it('should generate and store the lockEditorId', () => {
        generateLockEditorId();
        expect(window.editorLockID).toEqual(getLockEditorId());

        resetLockEditorId();
        expect(window.editorLockID).toBeUndefined();
    });
});
