/**
 * This functions are used to store and manage the current editor ID
 * the ID is persisted in the window so it can be used and stay the same during the usage of the editor
 *
 * window.editorLockID: used to identify the lock for the current editor in the back end
 */
export function resetLockEditorId() {
    window.editorLockID = undefined;
}

export function generateLockEditorId() {
    window.editorLockID = window.editorLockID || '_' + Math.random().toString(36).substr(2, 9);
}

export function getLockEditorId() {
    return window.editorLockID;
}
