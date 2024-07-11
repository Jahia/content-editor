import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './VanityUrls.scss';
import {getButtonRenderer} from '~/utils';
import {DisplayAction} from '@jahia/ui-extender';
import {Typography} from '@jahia/moonstone';
import clsx from 'clsx';
import {useNodeChecks} from '@jahia/data-helper';
import {useContentEditorContext} from '~/contexts/ContentEditor';

const ButtonRendererAccent = getButtonRenderer({defaultButtonProps: {variant: 'default', size: 'big', color: 'accent'}});

export const VanityUrls = () => {
    const {t} = useTranslation('content-editor');

    const {path} = useContentEditorContext();

    const {loading, checksResult: hasPermission} = useNodeChecks(
        {path},
        {
            requiredPermission: ['viewVanityUrlModal']
        }
    );

    if (loading) {
        /* eslint-disable react/jsx-no-useless-fragment */
        return (<></>);
    }

    return (
        <section className={styles.container}>
            <Typography variant="heading" className={clsx(styles.item, styles.capitalize)}>
                {t('content-editor:label.contentEditor.vanityTab.title')}
            </Typography>
            <Typography className={styles.item}>
                {hasPermission ?
                    t('content-editor:label.contentEditor.vanityTab.label') :
                    t('content-editor:label.contentEditor.vanityTab.noPermissionLabel')}
            </Typography>
            <div className={styles.item}>
                <DisplayAction actionKey="vanityUrls"
                               render={ButtonRendererAccent}
                />
            </div>
        </section>
    );
};
