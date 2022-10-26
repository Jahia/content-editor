import React from 'react';
import PropTypes from 'prop-types';
import {PublicationInfoBadge} from './PublicationInfoBadge';
import {LockInfoChip} from './LockInfoChip';
import {WipInfoChip} from './WipInfoChip';
import {UnsavedChip} from './UnsavedChip';
import {ReadOnlyBadge} from './ReadOnlyBadge';
import {Constants} from '~/ContentEditor.constants';
import styles from './HeaderBadges.scss';

export const HeaderBadges = ({mode}) => (
    <div className={styles.badges}>
        {mode === Constants.routes.baseEditRoute && <ReadOnlyBadge isGlobal/>}
        {mode === Constants.routes.baseEditRoute && <PublicationInfoBadge/>}
        {mode === Constants.routes.baseEditRoute && <LockInfoChip/>}
        <WipInfoChip/>
        {mode === Constants.routes.baseEditRoute && <UnsavedChip/>}
    </div>
);

HeaderBadges.propTypes = {
    mode: PropTypes.string.isRequired
};
