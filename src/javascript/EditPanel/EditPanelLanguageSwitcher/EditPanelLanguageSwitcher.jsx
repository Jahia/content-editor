import React, {useCallback, useState} from 'react';
import {Dropdown, toIconComponentFunction} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {EditPanelDialogConfirmation} from '../EditPanelDialogConfirmation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';
import styles from './EditPanelLanguageSwitcher.scss';

const MyIcon = toIconComponentFunction('<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<path d="M6.99337 0.333374C3.31337 0.333374 0.333374 3.32004 0.333374 7.00004C0.333374 10.68 3.31337 13.6667 6.99337 13.6667C10.68 13.6667 13.6667 10.68 13.6667 7.00004C13.6667 3.32004 10.68 0.333374 6.99337 0.333374ZM11.6134 4.33337H9.64671C9.43337 3.50004 9.12671 2.70004 8.72671 1.96004C9.95337 2.38004 10.9734 3.23337 11.6134 4.33337ZM7.00004 1.69337C7.55337 2.49337 7.98671 3.38004 8.27337 4.33337H5.72671C6.01337 3.38004 6.44671 2.49337 7.00004 1.69337ZM1.84004 8.33337C1.73337 7.90671 1.66671 7.46004 1.66671 7.00004C1.66671 6.54004 1.73337 6.09337 1.84004 5.66671H4.09337C4.04004 6.10671 4.00004 6.54671 4.00004 7.00004C4.00004 7.45337 4.04004 7.89337 4.09337 8.33337H1.84004ZM2.38671 9.66671H4.35337C4.56671 10.5 4.87337 11.3 5.27337 12.04C4.04671 11.62 3.02671 10.7734 2.38671 9.66671ZM4.35337 4.33337H2.38671C3.02671 3.22671 4.04671 2.38004 5.27337 1.96004C4.87337 2.70004 4.56671 3.50004 4.35337 4.33337ZM7.00004 12.3067C6.44671 11.5067 6.01337 10.62 5.72671 9.66671H8.27337C7.98671 10.62 7.55337 11.5067 7.00004 12.3067ZM8.56004 8.33337H5.44004C5.38004 7.89337 5.33337 7.45337 5.33337 7.00004C5.33337 6.54671 5.38004 6.10004 5.44004 5.66671H8.56004C8.62004 6.10004 8.66671 6.54671 8.66671 7.00004C8.66671 7.45337 8.62004 7.89337 8.56004 8.33337ZM8.72671 12.04C9.12671 11.3 9.43337 10.5 9.64671 9.66671H11.6134C10.9734 10.7667 9.95337 11.62 8.72671 12.04ZM9.90671 8.33337C9.96004 7.89337 10 7.45337 10 7.00004C10 6.54671 9.96004 6.10671 9.90671 5.66671H12.16C12.2667 6.09337 12.3334 6.54004 12.3334 7.00004C12.3334 7.46004 12.2667 7.90671 12.16 8.33337H9.90671Z" fill="currentColor"/>\n' +
    '</svg>\n');

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
                icon={<MyIcon/>}
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
