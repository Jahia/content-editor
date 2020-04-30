export const getBadgeContent = (nodeData, t) => {
    const LOCK_TYPE_VALIDATION = 'validation';
    const LOCK_TYPE_DELETION = 'deletion';

    if (nodeData && nodeData.lockInfo && nodeData.lockInfo.details && nodeData.lockInfo.details.length > 0) {
        let lockInfoDetails = nodeData.lockInfo.details.find(detail => detail.type === LOCK_TYPE_VALIDATION || detail.type === LOCK_TYPE_DELETION);
        if (lockInfoDetails) {
            return t('content-editor:label.contentEditor.edit.action.lock.' + lockInfoDetails.type);
        }

        lockInfoDetails = nodeData.lockInfo.details[0];
        if (lockInfoDetails && (lockInfoDetails.type === 'user' || lockInfoDetails.type === 'engine')) {
            return t('content-editor:label.contentEditor.edit.action.lock.' + lockInfoDetails.type, {userName: lockInfoDetails.owner});
        }
    }

    return t('content-editor:label.contentEditor.edit.action.lock.unknown');
};
