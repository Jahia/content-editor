import React from 'react';
import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {UnsavedChip} from '~/EditPanel/header';

const HeaderBadges = () => (
    <div>
        <PublicationInfoBadge/>
        <LockInfoBadge/>
        <WipInfoChip/>
        <UnsavedChip/>
    </div>
);

export default HeaderBadges;
