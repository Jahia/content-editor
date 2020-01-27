import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import {Badge} from '@jahia/design-system-kit';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {getBadgeContent} from './Lock.utils';

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
