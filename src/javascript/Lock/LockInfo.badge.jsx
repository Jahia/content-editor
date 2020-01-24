import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import {Badge} from '@jahia/design-system-kit';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';

const getBadgeContent = (nodeData, t) => {
    let lockInfoDetails = nodeData.lockInfo.details[0];
    let badgeContent;
    if (lockInfoDetails.type === 'engine' || lockInfoDetails.type === 'user') {
        badgeContent = t('content-editor:label.contentEditor.edit.action.lock.' + lockInfoDetails.type, {userName: lockInfoDetails.owner});
    } else {
        badgeContent = t('content-editor:label.contentEditor.edit.action.lock.' + lockInfoDetails.type);
    }

    return badgeContent;
};

export const LockInfoBadge = () => {
    const {t} = useTranslation();
    const {nodeData} = useContentEditorContext();

    return (
        <>
            {nodeData.lockedAndCannotBeEdited && <Badge data-sel-role="lock-info-badge"
                                                        badgeContent={getBadgeContent(nodeData, t)}
                                                        variant="normal"
                                                        color="error"
                                                        icon={<DeleteIcon/>}

            />}
        </>
    );
};

export default LockInfoBadge;
