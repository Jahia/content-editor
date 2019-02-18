// TODO: This file should be removed
// We should use/get the action from CMM directly
// The task was created: https://jira.jahia.org/browse/QA-11544

const CM_NAVIGATE = 'CM_NAVIGATE';

function cmGoto(data) {
    return Object.assign(data || {}, {type: CM_NAVIGATE});
}

export {
    cmGoto
};
