import React, {useState} from 'react';
import {Dropdown} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect} from 'formik';
import {EditPanelDialogConfirmation} from '../EditPanelDialogConfirmation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import envSwitchLanguages from './EditPanelLanguageSwitcher.env';

const EditPanelLanguageSwitcher = ({siteInfo, formik}) => {
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang} = contentEditorConfigContext;
    const [dialogConfirmation, setDialogConfirmation] = useState({open: false, lang: lang});
    let langLabel;

    const languages = siteInfo.languages.map(item => {
        const capitalizedDisplayName = item.displayName.charAt(0).toUpperCase() + item.displayName.slice(1);

        if (item.language === lang) {
            langLabel = capitalizedDisplayName;
        }

        return {label: capitalizedDisplayName, value: item.language};
    });

    const switchLanguage = (language, createdNodeUuid) => {
        const envSwitchLanguage = envSwitchLanguages[contentEditorConfigContext.env];
        if (envSwitchLanguage) {
            envSwitchLanguage(language, contentEditorConfigContext, createdNodeUuid);
        }

        // Switch edit mode linker language
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(language);
        }
    };

    return (
        <>
            <Dropdown
                data-cm-role="language-switcher"
                data={languages}
                value={lang}
                label={langLabel}
                size="small"
                onChange={(e, language) => {
                    if (language.value !== lang) {
                        if (formik.dirty) {
                            setDialogConfirmation({open: true, lang: language.value});
                        } else {
                            switchLanguage(language.value);
                        }
                    }
                }}
            />

            <EditPanelDialogConfirmation
                isOpen={dialogConfirmation.open}
                titleKey="content-editor:label.contentEditor.switchLanguage.dialog.title"
                formik={formik}
                actionCallback={createdNodeUuid => switchLanguage(dialogConfirmation.lang, createdNodeUuid)}
                onCloseDialog={() => setDialogConfirmation({open: false})}
            />
        </>
    );
};

EditPanelLanguageSwitcher.propTypes = {
    siteInfo: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

EditPanelLanguageSwitcher.displayName = 'EditPanelLanguageSwitcher';

export default compose(
    connect
)(EditPanelLanguageSwitcher);
