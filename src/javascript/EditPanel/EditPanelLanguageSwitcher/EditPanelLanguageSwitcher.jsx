import React, {useCallback, useState} from 'react';
import {Dropdown, Language} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {EditPanelDialogConfirmation} from '../EditPanelDialogConfirmation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';
import styles from './EditPanelLanguageSwitcher.scss';

const EditPanelLanguageSwitcher = ({siteInfo}) => {
    const formik = useFormikContext();
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

    const switchLanguage = useCallback((language, newNode) => {
        const envSwitchLanguage = contentEditorConfigContext.envProps.switchLanguageCallback;
        if (envSwitchLanguage) {
            envSwitchLanguage({newNode, language});
        }

        // Switch edit mode linker language
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(language);
        }
    }, [contentEditorConfigContext]);

    let onCloseDialog = useCallback(() => setDialogConfirmation({open: false}), [setDialogConfirmation]);
    let actionCallback = useCallback(({newNode}) => {
        switchLanguage(dialogConfirmation.lang, newNode);
    }, [switchLanguage, dialogConfirmation.lang]);

    return (
        <>
            <Dropdown
                className={styles.dropdown}
                icon={<Language/>}
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
                switchLang
                isOpen={dialogConfirmation.open}
                actionCallback={actionCallback}
                onCloseDialog={onCloseDialog}
            />
        </>
    );
};

EditPanelLanguageSwitcher.propTypes = {
    siteInfo: PropTypes.object.isRequired
};

EditPanelLanguageSwitcher.displayName = 'EditPanelLanguageSwitcher';

export default EditPanelLanguageSwitcher;
