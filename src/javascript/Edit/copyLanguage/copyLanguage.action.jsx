import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {CopyLanguageDialog} from '~/EditPanel/CopyLanguageDialog';
import {getFullLanguageName} from './copyLanguage.utils';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {useContentEditorContext} from "~/ContentEditor.context";
import {useFormikContext} from "formik";

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
                        language: getFullLanguageName(siteInfo.languages, lang),
                        availableLanguages: siteInfo.languages,
                        formik: formik,
                        onCloseDialog: () => destroy('CopyLanguageDialog')
                    });
                }}/>
    );
};

CopyLanguageActionComponent.propTypes = {
    language: PropTypes.string.isRequired,
    siteInfo: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    nodeData: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired
};
