import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './VanityUrls.scss';
import {getButtonRenderer} from '~/utils';
import {DisplayAction} from '@jahia/ui-extender';
import {Typography} from '@jahia/moonstone';
import clsx from 'clsx';

const ButtonRendererAccent = getButtonRenderer({defaultButtonProps: {variant: 'default', size: 'big', color: 'accent'}});

export const VanityUrls = () => {
    const {t} = useTranslation('content-editor');

    return (
        <section className={styles.container}>
            <Typography variant="heading" className={clsx(styles.item, styles.capitalize)}>
                {t('content-editor:label.contentEditor.vanityTab.title')}
            </Typography>
            <Typography className={styles.item}>
                {t('content-editor:label.contentEditor.vanityTab.label')}
            </Typography>
            <div className={styles.item}>
                <DisplayAction actionKey="vanityUrls"
                               render={ButtonRendererAccent}
                />
            </div>
        </section>
    );
};
