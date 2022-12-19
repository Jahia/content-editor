import React from 'react';
import {Dropdown, Edit, Language} from '@jahia/moonstone';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import styles from './EditPanelLanguageSwitcher.scss';
import {getCapitalized, useSwitchLanguage} from '~/utils';
import {useTranslation} from 'react-i18next';

export const EditPanelLanguageSwitcher = () => {
    const {mode, lang: currentLanguage} = useContentEditorConfigContext();
    const {i18nContext, nodeData, siteInfo} = useContentEditorContext();
    const switchLanguage = useSwitchLanguage();
    const {t} = useTranslation('content-editor');
    const labelPrefix = 'content-editor:label.contentEditor.header.languageSwitcher';

    function getLanguageOptions() {
        let langLabel; // Current dropdown selection
        const translatedOption = {groupLabel: t(`${labelPrefix}.switchLanguage`), options: []};
        const notTranslatedOption = {groupLabel: t(`${labelPrefix}.addTranslation.${mode}`), options: []};
        const translatedLangs = nodeData?.translationLanguages || [];

        siteInfo.languages.forEach(item => {
            const label = getCapitalized(item.displayName);
            if (item.language === currentLanguage) {
                langLabel = label;
            }

            // Group language options depending on whether node has been translated to this language already or not
            const isTranslated = translatedLangs.includes(item.language) ||
                // Check if a translation during create is empty or not
                (i18nContext[item.language]?.values && Object.values(i18nContext[item.language]?.values).some(Boolean));
            const group = isTranslated ? translatedOption : notTranslatedOption;
            group.options.push({
                label,
                value: item.language,
                iconEnd: i18nContext[item.language] ? <Edit/> : null
            });
        });

        const langOptions = [translatedOption, notTranslatedOption].filter(o => o.options.length); // Do not display group if empty
        return {langLabel, langOptions};
    }

    const {langLabel, langOptions} = getLanguageOptions();
    // Hide language switcher if site is not multi-language
    return (!siteInfo?.languages || siteInfo.languages.length <= 1) ? null : (
        <>
            <Dropdown
                className={styles.dropdown}
                icon={<Language/>}
                data-cm-role="language-switcher"
                data={langOptions}
                value={currentLanguage}
                label={langLabel}
                size="small"
                onChange={(e, language) => {
                    if (language.value !== currentLanguage) {
                        switchLanguage(language.value);
                    }
                }}
            />
        </>
    );
};

