import React from 'react';
import {compose, withApollo} from 'react-apollo';
import {translate} from 'react-i18next';
import {withNotifications} from '@jahia/react-material';
import EditPanelConstants from './EditPanel/EditPanelConstants';
import {Formik} from 'formik';
import * as _ from 'lodash';
import {getPropertiesToSave} from './EditPanel/EditPanel.utils';
import {SavePropertiesMutation} from './NodeData/NodeData.gql-mutation';
import {connect} from 'react-redux';
import {NodeQuery} from './NodeData/NodeData.gql-queries';
import EditPanel from './EditPanel';
import FormDefinitions from './FormDefinitions';
import NodeData from './NodeData';
import * as PropTypes from 'prop-types';

export class EditPanelContainer extends React.Component {
    render() {
        const {client, notificationContext, t, path, lang} = this.props;

        return (
            <NodeData>
                {({nodeData}) => {
                    let jsonFormDefinition = FormDefinitions[nodeData.primaryNodeType.name];

                    if (jsonFormDefinition) {
                        let fields = _.map(_.find(jsonFormDefinition.targets, {name: 'content'}).fields, fieldDefinition => {
                            return {
                                formDefinition: fieldDefinition,
                                jcrDefinition: _.find(nodeData.primaryNodeType.properties, {name: fieldDefinition.name}),
                                data: _.find(nodeData.properties, {name: fieldDefinition.name})
                            };
                        });

                        let initialValues = _.mapValues(_.keyBy(fields, 'formDefinition.name'), 'data.value');

                        return (
                            <Formik
                                initialValues={initialValues}
                                render={() => {
                                    return (
                                        <EditPanel t={t} fields={fields} title={nodeData.displayName}/>

                                    );
                                }}
                                onSubmit={(values, actions) => {
                                    switch (values[EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION]) {
                                        case EditPanelConstants.submitOperation.SAVE:
                                            client.mutate({
                                                variables: {
                                                    path: nodeData.path,
                                                    properties: getPropertiesToSave(values, fields)
                                                },
                                                mutation: SavePropertiesMutation,
                                                refetchQueries: [
                                                    {
                                                        query: NodeQuery,
                                                        variables: {
                                                            path: path,
                                                            language: lang
                                                        }
                                                    }
                                                ]
                                            }).then(() => {
                                                notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
                                                actions.setSubmitting(false);
                                            }, error => {
                                                console.error(error);
                                                notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.error'), ['closeButton']);
                                                actions.setSubmitting(false);
                                            });
                                            break;
                                        case EditPanelConstants.submitOperation.SAVE_PUBLISH:
                                            console.log('TODO SAVE_PUBLISH');
                                            actions.setSubmitting(false);
                                            break;
                                        default:
                                            console.log('Unknown submit operation: ' + values[EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION]);
                                            actions.setSubmitting(false);
                                            break;
                                    }
                                }}
                            />
                        );
                    }
                }}
            </NodeData>
        );
    }
}

const mapStateToProps = state => ({
    path: state.path,
    lang: state.language
});

EditPanelContainer.propTypes = {
    client: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    notificationContext: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired
};

export default compose(
    translate(),
    withNotifications(),
    connect(mapStateToProps),
    withApollo
)(EditPanelContainer);
