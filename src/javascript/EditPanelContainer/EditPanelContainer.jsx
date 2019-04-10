import React from 'react';
import {compose, withApollo} from 'react-apollo';
import {translate} from 'react-i18next';
import {withNotifications} from '@jahia/react-material';
import EditPanelConstants from './EditPanel/EditPanelConstants';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import EditPanel from './EditPanel';
import NodeData from './NodeData';
import * as PropTypes from 'prop-types';
import FormDefinition from './FormDefinitions';
import SiteData from './SiteData';
import {publishNode, saveNode} from './EditPanel.redux-actions';

// TODO modify SiteData with HOC, as well NodeData
export const EditPanelContainer = ({client, notificationContext, t, path, lang, uiLang}) => {
    return (
        <SiteData>
            {({siteInfo}) => {
                    return (
                        <NodeData>
                            {({nodeData}) => {
                                return (
                                    <FormDefinition uiLang={uiLang} lang={lang} path={path} nodeType={nodeData.primaryNodeType.name}>
                                        {({formDefinition}) => {
                                            if (formDefinition) {
                                                let fields = formDefinition.fields.map(fieldDefinition => {
                                                    return {
                                                        targets: fieldDefinition.targets,
                                                        formDefinition: fieldDefinition,
                                                        jcrDefinition: nodeData.primaryNodeType.properties.find(prop => prop.name === fieldDefinition.name),
                                                        data: nodeData.properties.find(prop => prop.name === fieldDefinition.name)
                                                    };
                                                });

                                                const initialValues = fields.reduce((initialValues, field) => {
                                                    return {
                                                        ...initialValues,
                                                        [field.formDefinition.name]: field.data && field.data.value
                                                    };
                                                }, {});

                                                return (
                                                    <Formik
                                                        initialValues={initialValues}
                                                        render={() => {
                                                            return (
                                                                <EditPanel path={path} t={t} fields={fields} title={nodeData.displayName} siteInfo={siteInfo} nodeData={nodeData}/>
                                                            );
                                                        }}
                                                        onSubmit={(values, actions) => {
                                                            switch (values[EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION]) {
                                                                case EditPanelConstants.submitOperation.SAVE:
                                                                    saveNode({
                                                                        client,
                                                                        nodeData,
                                                                        notificationContext,
                                                                        actions,
                                                                        path,
                                                                        lang,
                                                                        values,
                                                                        fields,
                                                                        t
                                                                    });
                                                                    break;
                                                                case EditPanelConstants.submitOperation.SAVE_PUBLISH:
                                                                    publishNode({
                                                                        client,
                                                                        nodeData,
                                                                        lang,
                                                                        notificationContext,
                                                                        actions,
                                                                        t
                                                                    });
                                                                    break;
                                                                default:
                                                                    console.warn('Unknown submit operation: ' + values[EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION]);
                                                                    actions.setSubmitting(false);
                                                                    break;
                                                            }
                                                        }}
                                                    />
                                                );
                                            }
                                        }}
                                    </FormDefinition>
                                );
                            }}
                        </NodeData>
                    );
                }}
        </SiteData>
    );
};

const mapStateToProps = state => ({
    path: state.path,
    lang: state.language,
    uiLang: state.uiLang
});

EditPanelContainer.propTypes = {
    client: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    notificationContext: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    uiLang: PropTypes.string.isRequired
};

export default compose(
    translate(),
    withNotifications(),
    connect(mapStateToProps),
    withApollo
)(EditPanelContainer);
