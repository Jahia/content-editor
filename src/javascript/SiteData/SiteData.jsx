import React from 'react';
import {compose} from 'react-apollo';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {SiteInfo} from '@jahia/react-apollo';

export const withSiteInfo = Children => {
    const SiteData = props => {
        const {notificationContext, site, lang} = props;
        const {t} = useTranslation();
        return (
            <SiteInfo siteKey={site} displayLanguage={lang}>
                {({siteInfo, error, loading}) => {
                    if (error) {
                        console.log('Error when fetching data: ' + error);
                        let message = t('label.contentEditor.error.queryingContent', {details: (error.message ? error.message : '')});
                        notificationContext.notify(message, ['closeButton', 'noAutomaticClose']);
                        return null;
                    }

                    if (loading) {
                        return <ProgressOverlay/>;
                    }

                    return <Children siteInfo={siteInfo} {...props}/>;
                }}
            </SiteInfo>
        );
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
