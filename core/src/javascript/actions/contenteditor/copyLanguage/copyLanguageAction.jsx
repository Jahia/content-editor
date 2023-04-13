import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {CopyLanguageDialog} from './CopyLanguageDialog';
import {getFullLanguageName} from './copyLanguage.utils';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {useFormikContext} from 'formik';

export const CopyLanguageActionComponent = ({render: Render, ...otherProps}) => {
    const {render, destroy} = useContext(ComponentRendererContext);
    const {nodeData, lang, siteInfo} = useContentEditorContext();
    const formik = useFormikContext();

    return (
        <Render {...otherProps}
                enabled={siteInfo.languages.length > 1 && nodeData.hasWritePermission}
                onClick={() => {
                    render('CopyLanguageDialog', CopyLanguageDialog, {
                        isOpen: true,
                        uuid: nodeData.uuid,
                        formik,
                        language: getFullLanguageName(siteInfo.languages, lang),
                        availableLanguages: siteInfo.languages,
                        onCloseDialog: () => destroy('CopyLanguageDialog')
                    });
                }}/>
    );
};

CopyLanguageActionComponent.propTypes = {
    render: PropTypes.func.isRequired
};

export const copyLanguageAction = {
    component: CopyLanguageActionComponent
};
