import styles from './Validation.scss';
import React, {useMemo} from 'react';
import {useFormikContext} from 'formik';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {getFields} from '~/EditPanel/EditPanel.utils';
import {useTranslation} from 'react-i18next';

export const Validation = () => {
    const formik = useFormikContext();
    const {sections} = useContentEditorSectionContext();
    const {t} = useTranslation('content-editor');
    const fields = useMemo(() => getFields(sections), [sections]);
    const fieldsInError = fields.filter(f => Object.keys(formik.errors).indexOf(f.name) > -1);

    const onClick = field => {
        const fieldElement = window.document.querySelector('div[data-sel-content-editor-field="' + field + '"]');
        window.document.querySelector('#contenteditor-dialog-content').scroll(0, fieldElement.offsetTop);
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
