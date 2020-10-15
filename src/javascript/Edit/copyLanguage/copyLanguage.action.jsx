import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {CopyLanguageDialog} from '~/EditPanel/CopyLanguageDialog';
import {getFullLanguageName} from './copyLanguage.utils';
import {ComponentRendererContext} from '@jahia/ui-extender';

export const CopyLanguageActionComponent = ({siteInfo, nodeData, formik, language, render: Render, ...otherProps}) => {
    const {render, destroy} = useContext(ComponentRendererContext);

    return (
        <Render {...otherProps}
                enabled={siteInfo.languages.length > 1 && nodeData.hasWritePermission}
                onClick={() => {
                    render('CopyLanguageDialog', CopyLanguageDialog, {
                        isOpen: true,
                        uuid: nodeData.uuid,
                        language: getFullLanguageName(siteInfo.languages, language),
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
