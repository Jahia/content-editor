import React from 'react';
import {LinearProgress} from '@material-ui/core';
import {usePublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import styles from './PublicationInfoProgress.scss';

export const PublicationInfoProgress = () => {
    const {publicationInfoPolling} = usePublicationInfoContext();
    return (
        <>
            {publicationInfoPolling && <LinearProgress classes={styles}/>}
        </>
    );
};
