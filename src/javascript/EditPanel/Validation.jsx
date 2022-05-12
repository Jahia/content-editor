import styles from './Validation.scss';
import React, {useMemo} from 'react';
import {useFormikContext} from 'formik';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {ceToggleSections} from '~/redux/registerReducer';

function scrollTo(field) {
    const fieldElement = window.document.querySelector('div[data-sel-content-editor-field="' + field + '"]');
    window.document.querySelector('form').scroll(0, fieldElement.offsetTop);
}

export const Validation = () => {
    const formik = useFormikContext();
    const {sections} = useContentEditorSectionContext();
    const {t} = useTranslation('content-editor');
    const toggleStates = useSelector(state => state.contenteditor.ceToggleSections);
    const dispatch = useDispatch();
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

    const fieldsInError = fields.filter(f => Object.keys(formik.errors).indexOf(f.name) > -1);

    const onClick = field => {
        const section = sectionsForField[field];
        if (toggleStates[section.name]) {
            scrollTo(field);
        } else {
            dispatch(ceToggleSections({
                ...toggleStates,
                [section.name]: true
            }));
            setTimeout(() => scrollTo(field), 0);
        }
    };

    return fieldsInError.length > 0 && (
        <div className={styles.validationWarningBox}>
            {t('label.contentEditor.edit.validation.fieldsInError', {count: fieldsInError.length})} : &nbsp;
            {fieldsInError.map(
                field => (
                    <span key={field.name} className={styles.field}><a href="#" className={styles.fieldLink} onClick={() => onClick(field.name)}>{field.displayName}</a></span>
                ))}
        </div>
    );
};
