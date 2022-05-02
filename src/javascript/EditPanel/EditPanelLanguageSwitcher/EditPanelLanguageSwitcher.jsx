import React, {useCallback} from 'react';
import {Dropdown, Language} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';
import styles from './EditPanelLanguageSwitcher.scss';
import {getDynamicFieldSets, getFields} from '~/EditPanel/EditPanel.utils';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';

const EditPanelLanguageSwitcher = ({siteInfo}) => {
    const formik = useFormikContext();

    const {setI18nContext} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const {lang: currentLanguage, envProps} = useContentEditorConfigContext();
    let langLabel;

    const languages = siteInfo.languages.map(item => {
        const capitalizedDisplayName = item.displayName.charAt(0).toUpperCase() + item.displayName.slice(1);

        if (item.language === currentLanguage) {
            langLabel = capitalizedDisplayName;
        }

        return {label: capitalizedDisplayName, value: item.language};
    });

    const switchLanguage = useCallback((language, previousLanguage, newNode) => {
        const fields = sections && getFields(sections).filter(field => !field.readOnly);
        const dynamicFieldSets = getDynamicFieldSets(sections);

        const i18nValues = {};
        const nonI18nValues = {};
        const fieldsObj = fields.reduce((r, f) => Object.assign(r, {[f.name]: f}), {});
        Object.keys(formik.values).filter(key => formik.values[key] !== formik.initialValues[key]).forEach(key => {
            if (fieldsObj[key]) {
                if (fieldsObj[key].i18n) {
                    i18nValues[key] = formik.values[key];
                } else {
                    nonI18nValues[key] = formik.values[key];
                }
            } else if (typeof dynamicFieldSets[key] === 'boolean') {
                nonI18nValues[key] = formik.values[key];
            }
        });

        setI18nContext(prev => ({
            ...prev,
            shared: nonI18nValues,
            [previousLanguage]: i18nValues
        }));

        // Todo we can simplify callback parameters here
        if (envProps.switchLanguageCallback) {
            envProps.switchLanguageCallback({
                language,
                previousLanguage,
                newNode,
                values: formik.values
            });
        }

        // Switch edit mode linker language
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(language);
        }
    }, [envProps, formik, sections, setI18nContext]);

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
                        switchLanguage(language.value, currentLanguage);
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
