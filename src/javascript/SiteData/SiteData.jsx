import React from 'react';
import {compose} from '~/utils';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {useSiteInfo} from '@jahia/data-helper';

export const withSiteInfo = Children => {
    const SiteData = props => {
        const {notificationContext, site, lang} = props;
        const {t} = useTranslation();
        const {siteInfo, error, loading} = useSiteInfo({
            siteKey: site,
            displayLanguage: lang
        });
        if (error) {
            console.error('Error when fetching data: ' + error);
            let message = t('label.contentEditor.error.queryingContent', {details: (error.message ? error.message : '')});
            notificationContext.notify(message, ['closeButton', 'noAutomaticClose']);
            return null;
        }

        if (loading) {
            return <ProgressOverlay/>;
        }

        return <Children siteInfo={siteInfo} {...props}/>;
    };

    const mapStateToProps = state => ({
        site: state.site,
        lang: state.language
    });

    SiteData.propTypes = {
        lang: PropTypes.string.isRequired,
        notificationContext: PropTypes.object.isRequired,
        site: PropTypes.string.isRequired
    };

    return compose(
        withNotifications(),
        connect(mapStateToProps)
    )(SiteData);
};

withSiteInfo.displayName = 'withSiteInfo';
