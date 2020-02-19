import React from 'react';
import {composeActions, componentRendererAction} from '@jahia/react-material';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';
import {Constants} from '~/ContentEditor.constants';
import {withLockedEditorContextAction} from './withLockedEditorContext.action';
import {withContentEditorConfigContextAction} from './withContentEditorConfigContext';
import envBackActions from './goBack.action.env';

export const resolveGoBackContext = (path, parentPath, parentDisplayName, site, siteDisplayName) => {
    const splitPath = path.split('/');
    const modePath = splitPath && splitPath.length >= 4 ? splitPath[3] : ''; // 4: path at least contains files or contents info

    let resolvedPath = `/sites/${site}/${modePath}`;
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
    withContentEditorConfigContextAction,
    {
        init: context => {
            context.resolveUrlContext = resolveGoBackContext(context.nodeData.path, context.nodeData.parent.path, context.nodeData.parent.displayName, context.contentEditorConfigContext.site, context.siteInfo.displayName);
            context.buttonLabelParams = {parentNodeDisplayName: context.resolveUrlContext.displayName};
        },
        onClick: context => {
            if (context.formik) {
                const {contentEditorConfigContext, lockedEditorContext} = context;

                const executeGoBackAction = () => {
                    const envBackAction = envBackActions[contentEditorConfigContext.env];
                    if (envBackAction) {
                        if (lockedEditorContext.unlockEditor) {
                            lockedEditorContext.unlockEditor(() => {
                                envBackAction(context);
                            });
                        } else {
                            envBackAction(context);
                        }
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
