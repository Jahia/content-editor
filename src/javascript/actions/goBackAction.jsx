import React from 'react';
import {translate} from 'react-i18next';
import {composeActions, componentRendererAction} from '@jahia/react-material';
import {withFormikAction} from './withFormikAction';
import {reduxAction} from './reduxAction';
import {cmGoto} from '../ContentManager.redux-actions';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import EditPanelConstants from '../EditPanelContainer/EditPanel/EditPanelConstants';

const mapDispatchToContext = dispatch => ({
    setUrl: (site, language, mode, path, params) => dispatch(cmGoto({site, language, mode, path, params}))
});

const mapStateToProps = state => ({
    language: state.language,
    siteKey: state.site
});

class DialogConfirmation extends React.Component {
    render() {
        const {t, open, onClose, onCloseWithoutSave, onCloseAndSave, onExited} = this.props;

        return (
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-slide-title"
                onClose={onClose}
                onExited={onExited}
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {t('content-editor:label.contentEditor.edit.action.goBack.title')}
                </DialogTitle>
                <DialogActions>
                    <Button color="default" onClick={onClose}>
                        {t('content-editor:label.contentEditor.edit.action.goBack.btnContinue')}
                    </Button>
                    <Button color="default" onClick={onCloseWithoutSave}>
                        {t('content-editor:label.contentEditor.edit.action.goBack.btnDiscard')}
                    </Button>
                    <Button color="primary" onClick={onCloseAndSave}>
                        {t('content-editor:label.contentEditor.edit.action.goBack.btnSave')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

DialogConfirmation.propTypes = {
    t: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCloseWithoutSave: PropTypes.func.isRequired,
    onCloseAndSave: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired
};

const DialogConfirmationTranslated = translate()(DialogConfirmation);

export default composeActions(
    withFormikAction,
    componentRendererAction,
    reduxAction(mapStateToProps, mapDispatchToContext),
    {
        init: context => {
            context.buttonLabelParams = {parentNodeDisplayName: context.nodeData.parent.displayName};
        },
        onClick: context => {
            if (context.formik) {
                const {mode, siteKey, language, setUrl} = context;
                const resolvedPath = `/sites/${siteKey}/contents`;

                if (context.formik.dirty) {
                    const handler = context.renderComponent(
                        <DialogConfirmationTranslated
                            open
                            onClose={() => {
                                handler.setProps({open: false});
                            }}
                            onCloseWithoutSave={() => {
                                handler.setProps({open: false});

                                setUrl(siteKey, language, mode, resolvedPath, {});
                            }}
                            onCloseAndSave={() => {
                                handler.setProps({open: false});

                                const {setFieldValue, submitForm} = context.formik;
                                setFieldValue(EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION, EditPanelConstants.submitOperation.SAVE, false);

                                submitForm().then(() => setUrl(siteKey, language, mode, resolvedPath, {}));
                            }}
                            onExited={() => {
                                handler.destroy();
                            }}
                        />
                    );
                } else {
                    setUrl(siteKey, language, mode, resolvedPath, {});
                }
            }
        }
    }
);
