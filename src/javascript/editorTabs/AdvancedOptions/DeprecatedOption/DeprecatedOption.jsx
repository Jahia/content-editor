import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import styles from './DeprecatedOption.scss';
import {getButtonRenderer} from '~/utils';
import {DisplayAction} from '@jahia/ui-extender';
import {Typography} from '@jahia/moonstone';
import clsx from 'clsx';

const ButtonRenderer = getButtonRenderer({defaultButtonProps: {variant: 'default', size: 'big', color: 'accent'}});

export const DeprecatedOption = ({tab, actionKey}) => {
    const {t} = useTranslation('content-editor');

    return (
        <section className={styles.container}>
            <Typography variant="heading" className={clsx(styles.item, styles.capitalize)}>
                {tab} - {t('content-editor:label.contentEditor.gwtTabsDeprecation.title')}
            </Typography>
            <Typography className={styles.item}>
                {t(`content-editor:label.contentEditor.gwtTabsDeprecation.warnings.${tab}`)}
            </Typography>
            <div className={styles.item}>
                <DisplayAction actionKey={actionKey}
                               render={props => <ButtonRenderer {...props} buttonLabel={t('content-editor:label.contentEditor.gwtTabsDeprecation.openLegacy')}/>}
                />
            </div>
        </section>
    );
};

DeprecatedOption.propTypes = {
    tab: PropTypes.string.isRequired,
    actionKey: PropTypes.string.isRequired
};
