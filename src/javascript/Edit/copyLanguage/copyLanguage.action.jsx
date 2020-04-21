import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {CopyLanguageDialog} from '~/EditPanel/CopyLanguageDialog';
import {getFullLanguageName} from './copyLanguage.utils';
import {ComponentRendererContext} from '@jahia/ui-extender';

export const CopyLanguageActionComponent = ({context, render: Render}) => {
    const {render, destroy} = useContext(ComponentRendererContext);

    return (
        <Render context={{
            ...context,
            enabled: context.siteInfo.languages.length > 1 && context.nodeData.hasWritePermission,
            onClick: () => {
                render('CopyLanguageDialog', CopyLanguageDialog, {
                    isOpen: true,
                    uuid: context.nodeData.uuid,
                    language: getFullLanguageName(context.siteInfo.languages, context.language),
                    availableLanguages: context.siteInfo.languages,
                    formik: context.formik,
                    onCloseDialog: () => destroy('CopyLanguageDialog')
                });
            }
        }}/>
    );
};

CopyLanguageActionComponent.propTypes = {
    context: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};
