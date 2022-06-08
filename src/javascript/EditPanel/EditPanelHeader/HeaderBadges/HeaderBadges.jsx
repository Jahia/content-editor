import React from 'react';
import PropTypes from 'prop-types';
import PublicationInfoBadge from '~/PublicationInfo/PublicationInfoBadge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {UnsavedChip} from '~/EditPanel/EditPanelHeader';
import {Constants} from '~/ContentEditor.constants';
import styles from './HeaderBadges.scss';

const HeaderBadges = ({mode}) => (
    <div className={styles.badges}>
        {mode === Constants.routes.baseEditRoute && <PublicationInfoBadge/>}
        {mode === Constants.routes.baseEditRoute && <LockInfoBadge/>}
        <WipInfoChip/>
        {mode === Constants.routes.baseEditRoute && <UnsavedChip/>}
    </div>
);

HeaderBadges.propTypes = {
    mode: PropTypes.string.isRequired
};

export default HeaderBadges;
