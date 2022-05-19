import React from 'react';
import {Dropdown, Language, Edit} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import styles from './EditPanelLanguageSwitcher.scss';
import {useSwitchLanguage} from '~/utils/useSwitchLanguage';
import {getCapitalized} from '~/utils';

const EditPanelLanguageSwitcher = ({siteInfo}) => {
    const {lang: currentLanguage} = useContentEditorConfigContext();
    const {i18nContext} = useContentEditorContext();
    let langLabel;

    const languages = siteInfo.languages.map(item => {
        const capitalizedDisplayName = getCapitalized(item.displayName);

        if (item.language === currentLanguage) {
            langLabel = capitalizedDisplayName;
        }

        return {label: capitalizedDisplayName, value: item.language, iconEnd: i18nContext[item.language] ? <Edit/> : null};
    });

    const switchLanguage = useSwitchLanguage();

    return (
        <>
            <Dropdown
                className={styles.dropdown}
                icon={<Language/>}
                data-cm-role="language-switcher"
                data={languages}
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

EditPanelLanguageSwitcher.propTypes = {
    siteInfo: PropTypes.object.isRequired
};

EditPanelLanguageSwitcher.displayName = 'EditPanelLanguageSwitcher';

export default EditPanelLanguageSwitcher;
