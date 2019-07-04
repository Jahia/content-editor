import React from 'react';
import {composeActions, componentRendererAction} from '@jahia/react-material';
import {EditPanelDialogConfirmation} from '../EditPanelContainer/EditPanel/EditPanelDialogConfirmation';
import {withFormikAction} from './withFormikAction';
import {reduxAction} from './reduxAction';
import {cmGoto} from '../ContentManager.redux-actions';
import EditPanelConstants from '../EditPanelContainer/EditPanel/EditPanelConstants';

const mapDispatchToContext = dispatch => ({
    setUrl: (site, language, mode, path, params) => dispatch(cmGoto({site, language, mode, path, params}))
});

const mapStateToProps = state => ({
    language: state.language,
    siteKey: state.site
});

export const resolveGoBackContext = (path, parentPath, parentDisplayName, siteKey, siteDisplayName) => {
    const splitPath = path.split('/');
    let isFilePath = splitPath && splitPath.length >= 4 && splitPath[3] === 'files'; // 4: path at least contains files or contents info

    let resolvedPath = isFilePath ? `/sites/${siteKey}/files` : `/sites/${siteKey}/contents`;
    let resolvedMode = isFilePath ? EditPanelConstants.browseFilesRoute : EditPanelConstants.browseRoute;
    let resolvedDisplayName = siteDisplayName;

    // Resolve parent if possible
    if (splitPath.length >= 5) { // 5: path at least contains a displayable parent in CMM
        resolvedPath = parentPath;
        resolvedDisplayName = parentDisplayName;
    }

    return {
        displayName: resolvedDisplayName,
        path: resolvedPath,
        mode: resolvedMode
    };
};

export default composeActions(
    withFormikAction,
    componentRendererAction,
    reduxAction(mapStateToProps, mapDispatchToContext),
    {
        init: context => {
            context.resolveUrlContext = resolveGoBackContext(context.nodeData.path, context.nodeData.parent.path, context.nodeData.parent.displayName, context.siteKey, context.siteInfo.displayName);
            context.buttonLabelParams = {parentNodeDisplayName: context.resolveUrlContext.displayName};
        },
        onClick: context => {
            if (context.formik) {
                const {siteKey, language, setUrl} = context;

                const executeGoBackAction = () => {
                    setUrl(siteKey, language, context.resolveUrlContext.mode, context.resolveUrlContext.path, {});
                };

                if (context.formik.dirty) {
                    const handler = context.renderComponent(
                        <EditPanelDialogConfirmation
                            open
                            allowDiscard
                            formik={context.formik}
                            actionCallback={() => executeGoBackAction()}
                            onCloseDialog={() => handler.setProps({open: false})}
                        />
                    );
                } else {
                    executeGoBackAction();
                }
            }
        }
    }
);
