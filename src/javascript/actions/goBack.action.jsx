import React from 'react';
import {composeActions, componentRendererAction} from '@jahia/react-material';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import {reduxAction} from './redux.action';
import {cmGoto} from '../ContentManager.redux-actions';
import {Constants} from '~/ContentEditor.constants';
import {withLockedEditorContextAction} from './withLockedEditorContext.action';

const mapDispatchToContext = dispatch => ({
    setUrl: (site, language, mode, path, params) => dispatch(cmGoto({site, language, mode, path, params}))
});

const mapStateToProps = state => ({
    language: state.language,
    siteKey: state.site
});

export const resolveGoBackContext = (path, parentPath, parentDisplayName, siteKey, siteDisplayName) => {
    const splitPath = path.split('/');
    const modePath = splitPath && splitPath.length >= 4 ? splitPath[3] : ''; // 4: path at least contains files or contents info

    let resolvedPath = `/sites/${siteKey}/${modePath}`;
    let resolvedMode = Constants.routes.browseMap[modePath] || Constants.routes.browseMap.pages;
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
    withLockedEditorContextAction,
    componentRendererAction,
    reduxAction(mapStateToProps, mapDispatchToContext),
    {
        init: context => {
            context.resolveUrlContext = resolveGoBackContext(context.nodeData.path, context.nodeData.parent.path, context.nodeData.parent.displayName, context.siteKey, context.siteInfo.displayName);
            context.buttonLabelParams = {parentNodeDisplayName: context.resolveUrlContext.displayName};
        },
        onClick: context => {
            if (context.formik) {
                const {siteKey, language, setUrl, lockedEditorContext} = context;

                const executeGoBackAction = () => {
                    if (lockedEditorContext.unlockEditor) {
                        lockedEditorContext.unlockEditor(() => {
                            setUrl(siteKey, language, context.resolveUrlContext.mode, context.resolveUrlContext.path, {});
                        });
                    } else {
                        setUrl(siteKey, language, context.resolveUrlContext.mode, context.resolveUrlContext.path, {});
                    }
                };

                if (context.formik.dirty) {
                    const handler = context.renderComponent(
                        <EditPanelDialogConfirmation
                            open
                            titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
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
