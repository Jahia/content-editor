import React from 'react';
import {compose, Query, withApollo} from 'react-apollo';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {NodeQuery} from './NodeData.gql-queries';
import * as PropTypes from 'prop-types';

export const NodeData = ({t, path, lang, children}) => {
    let queryParams = {
        path: path,
        language: lang
    };

    return (
        // Should be fetchPolicy="cache-first", but CMM is still using GWT actions (like publish), and cached data is probaly not good after using CMM GWT actions.
        // TODO set fetchPolicy="cache-first" and use refetchQuery when CMM will be able to use react publish actions
        <Query query={NodeQuery} variables={queryParams} fetchPolicy="network-only">
            {({loading, error, data}) => {
                if (error) {
                    let message = t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')});
                    return (<>{message}</>);
                }

                if (loading) {
                    return (<ProgressOverlay/>);
                }

                return (
                    <>
                        {children({
                            nodeData: data.jcr.result
                        })}
                    </>
                );
            }}
        </Query>
    );
};

const mapStateToProps = state => ({
    path: state.path,
    lang: state.language
});

NodeData.propTypes = {
    children: PropTypes.func.isRequired,
    t: PropTypes.func,
    path: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired
};

NodeData.defaultProps = {
    t: s => s
};

export default compose(
    withNotifications(),
    translate(),
    withApollo,
    connect(mapStateToProps)
)(NodeData);
