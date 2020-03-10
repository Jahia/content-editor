import React from 'react';
import {composeActions, componentRendererAction} from '@jahia/react-material';
import {editRestrictedAction} from '~/actions/editRestricted.action';
import {CopyLanguageDialog} from '~/EditPanel/CopyLanguageDialog';
import {getFullLanguageName} from './copyLanguage.utils';

export default composeActions(
    editRestrictedAction,
    componentRendererAction,
    {
        init: context => {
            context.enabled = context.siteInfo.languages.length > 1;
        },
        onClick: context => {
            if (context.enabled) {
                const handler = context.renderComponent(
                    <CopyLanguageDialog
                        isOpen
                        nodePath={context.nodeData.path}
                        language={getFullLanguageName(context.siteInfo.languages, context.language)}
                        availableLanguages={context.siteInfo.languages}
                        formik={context.formik}
                        onCloseDialog={() => handler.setProps({isOpen: false})}
                    />);
            }
        }
    }
);
