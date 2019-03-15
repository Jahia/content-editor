import React from 'react';
import {compose, Query, withApollo} from 'react-apollo';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {translate} from 'react-i18next';
import {FormQuery} from './FormDefinition.gql-queries';
import * as PropTypes from 'prop-types';

const FormDefinition = ({t, path, nodeType, uiLang, children}) => {
    let queryParams = {
        nodeType: nodeType,
        uiLang: uiLang,
        nodeIdOrPath: path
    };
    return (
        <Query query={FormQuery} variables={queryParams} fetchPolicy="cache-first">
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
                            formDefinition: data.forms.form
                        })}
                    </>
                );
            }}
        </Query>
    );
};

FormDefinition.propTypes = {
    children: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    uiLang: PropTypes.string.isRequired,
    nodeType: PropTypes.string.isRequired,
    t: PropTypes.func
};

FormDefinition.defaultProps = {
    t: s => s
};

export default compose(
    withNotifications(),
    translate(),
    withApollo
)(FormDefinition);
