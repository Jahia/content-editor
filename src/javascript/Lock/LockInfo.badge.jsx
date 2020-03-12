import React from 'react';
import {Chip} from '@jahia/moonstone';
import {Lock} from '@jahia/moonstone/dist/icons';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {getBadgeContent} from './Lock.utils';

export const LockInfoBadge = () => {
    const {t} = useTranslation();
    const {nodeData} = useContentEditorContext();
    return (
        <>
            {nodeData.lockedAndCannotBeEdited &&
            <Chip
                data-sel-role="lock-info-badge"
                label={getBadgeContent(nodeData, t)}
                icon={<Lock/>}
                color="warning"
            />}
        </>
    );
};

export default LockInfoBadge;
