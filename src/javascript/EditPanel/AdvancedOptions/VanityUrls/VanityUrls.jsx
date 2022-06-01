import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import classes from './VanityUrls.scss';
import {getButtonRenderer} from '~/utils/getButtonRenderer';
import {DisplayAction} from '@jahia/ui-extender';
import {Typography} from '@jahia/moonstone';
import classnames from 'clsx';

const ButtonRenderer = getButtonRenderer({defaultButtonProps: {variant: 'default', size: 'big', color: 'default'}});
const ButtonRendererAccent = getButtonRenderer({defaultButtonProps: {variant: 'default', size: 'big', color: 'accent'}});

export const VanityUrls = ({tab, actionKey}) => {
    const {t} = useTranslation('content-editor');

    return (
        <section className={classes.container}>
            <Typography variant="heading" className={classnames(classes.item, classes.capitalize)}>
                {tab} - {t('content-editor:label.contentEditor.gwtTabsDeprecation.title')}
            </Typography>
            <Typography className={classes.item}>
                {t(`content-editor:label.contentEditor.gwtTabsDeprecation.warnings.${tab}`)}
            </Typography>
            <div className={classes.item}>
                <DisplayAction actionKey={actionKey}
                               render={props => <ButtonRenderer {...props} buttonLabel={t('content-editor:label.contentEditor.gwtTabsDeprecation.openLegacy')}/>}
                />
                <DisplayAction actionKey="vanityUrls"
                               render={ButtonRendererAccent}
                />
            </div>
        </section>
    );
};

VanityUrls.propTypes = {
    tab: PropTypes.string.isRequired,
    actionKey: PropTypes.string.isRequired
};
