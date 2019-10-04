import {composeActions, componentRendererAction} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {withFormikAction} from '~/actions/withFormik.action';
import {reduxAction} from '~/actions/redux.action';
import {SaveErrorModal} from './SaveErrorModal';
import React from 'react';

const mapStateToContext = state => {
    return {
        mode: state.mode
    };
};

export default composeActions(
    withFormikAction,
    componentRendererAction,
    reduxAction(mapStateToContext),
    {
        init: context => {
            context.enabled = context.mode === Constants.routes.baseEditRoute;

            context.addWarningBadge = Object.keys(context.formik.errors).length > 0;
        },
        onClick: ({formik, renderComponent}) => {
            if (!formik || !formik.dirty) {
                return;
            }

            // If form has errors
            const nbOfErrors = Object.keys(formik.errors).length;
            if (nbOfErrors > 0) {
                const handler = renderComponent(
                    <SaveErrorModal open
                                    nbOfErrors={nbOfErrors}
                                    onClose={() => {
                                        handler.setProps({open: false});
                                    }
                                }/>
                );
                return;
            }

            const {submitForm, resetForm, setFieldValue} = formik;

            setFieldValue(
                Constants.editPanel.OPERATION_FIELD,
                Constants.editPanel.submitOperation.SAVE,
                false
            );

            submitForm()
                .then(() => resetForm(formik.values));
        }
    });
