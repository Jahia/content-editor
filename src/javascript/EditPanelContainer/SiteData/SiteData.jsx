import React from 'react';
import {compose} from 'react-apollo';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {SiteInfo} from '@jahia/react-apollo';

export const SiteData = ({notificationContext, t, site, lang, children}) => {
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

                    const Children = children;
                    return <Children siteInfo={siteInfo}/>;
                }}
        </SiteInfo>
    );
};

const mapStateToProps = state => ({
    site: state.site,
    lang: state.language
});

SiteData.propTypes = {
    children: PropTypes.func.isRequired,
    t: PropTypes.func,
    lang: PropTypes.string.isRequired,
    notificationContext: PropTypes.object.isRequired,
    site: PropTypes.string.isRequired
};

SiteData.defaultProps = {
    t: s => s
};

export default compose(
    withNotifications(),
    translate(),
    connect(mapStateToProps)
)(SiteData);
