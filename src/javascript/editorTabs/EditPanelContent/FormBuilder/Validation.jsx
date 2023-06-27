import styles from './Validation.scss';
import React, {useMemo} from 'react';
import {useFormikContext} from 'formik';
import {useContentEditorConfigContext, useContentEditorContext, useContentEditorSectionContext} from '~/contexts';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {ceToggleSections} from '~/registerReducer';
import {Typography, Warning} from '@jahia/moonstone';
import clsx from 'clsx';
import {getCapitalized, useSwitchLanguage} from '~/utils';

function scrollTo(field) {
    const fieldElement = window.document.querySelector('div[data-sel-content-editor-field="' + field + '"]');
    window.document.querySelector('form').scroll(0, fieldElement.offsetTop);
}

function getFieldsInError(fields, errors) {
    return fields.filter(f => Object.keys(errors).indexOf(f.name) > -1);
}

export const Validation = () => {
    const formik = useFormikContext();
    const {sections} = useContentEditorSectionContext();
    const {siteInfo, i18nContext, lang} = useContentEditorContext();
    const {formKey} = useContentEditorConfigContext();
    const {t} = useTranslation('content-editor');
    const toggleStates = useSelector(state => state.contenteditor.ceToggleSections);
    const dispatch = useDispatch();
    const switchLanguage = useSwitchLanguage();

    const [fields, sectionsForField] = useMemo(() => {
        const _sectionsForField = {};
        const _fields = [];
        sections.forEach(section => {
            section.fieldSets.forEach(fieldSet => {
                fieldSet.fields.forEach(field => {
                    _fields.push(field);
                    _sectionsForField[field.name] = section;
                });
            });
        });
        return [_fields, _sectionsForField];
    }, [sections]);

    const fieldsInError = getFieldsInError(fields, formik.errors);
    const i18nErrors = Object.keys(i18nContext)
        .filter(language => language !== 'shared' && language !== 'memo' && language !== lang)
        .filter(language => getFieldsInError(fields, i18nContext[language].validation).length > 0);

    const onClick = field => {
        const section = sectionsForField[field];
        if (toggleStates[section.name]) {
            scrollTo(field);
        } else {
            dispatch(ceToggleSections({key: formKey, sections: {
                ...toggleStates[formKey],
                [section.name]: true
            }}));
            setTimeout(() => scrollTo(field), 0);
        }
    };

    return (fieldsInError.length > 0 || Object.keys(i18nErrors).length > 0) && (
        <div className={clsx(styles.validationWarningBox, 'flexRow_nowrap', 'alignCenter')}>
            <Warning size="big" color="yellow" className={styles.icon}/>
            <div className="flexCol">
                <Typography weight="semiBold">{t('label.contentEditor.edit.validation.invalidForm')}</Typography>
                {fieldsInError.length > 0 && (
                    <Typography>
                        {t('label.contentEditor.edit.validation.fieldsInError', {count: fieldsInError.length})} : &nbsp;
                        {fieldsInError.map(field => (
                            <span key={field.name} className={styles.field}>
                                <a href="#" className={styles.fieldLink} onClick={() => onClick(field.name)}>{field.displayName}</a>
                            </span>
                        ))}
                    </Typography>
                )}
                {i18nErrors.length > 0 && (
                    <Typography>
                        {t('label.contentEditor.edit.validation.otherLanguages')} : &nbsp;
                        {i18nErrors.map(lang => (
                            <span key={lang} className={styles.field}>
                                <a href="#" className={styles.fieldLink} onClick={() => switchLanguage(lang)}>{getCapitalized(siteInfo.languages.find(l => l.language === lang).displayName)}</a>
                            </span>
                        ))}
                    </Typography>
                )}
            </div>
        </div>
    );
};
