import {useCallback} from 'react';
import {validate} from '~/validation';
import {getDynamicFieldSets, getFields} from '~/utils';
import {useContentEditorConfigContext, useContentEditorContext, useContentEditorSectionContext} from '~/contexts';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';

function fillValues(newValues, previousValues, fieldsObj, i18nValues, nonI18nValues, dynamicFieldSets) {
    Object.keys(newValues)
        .filter(key => (newValues[key] !== previousValues[key]))
        .forEach(key => {
            if (fieldsObj[key]) {
                if (fieldsObj[key].i18n) {
                    i18nValues.values[key] = newValues[key];
                } else {
                    nonI18nValues.values[key] = newValues[key];
                }
            } else if (typeof dynamicFieldSets[key] === 'boolean') {
                nonI18nValues.values[key] = newValues[key];
            }
        });
}

function fillErrors(validation, fieldsObj, i18nValues) {
    Object.keys(validation).forEach(key => {
        if (fieldsObj[key]) {
            if (fieldsObj[key].i18n) {
                i18nValues.validation[key] = validation[key];
            }
        }
    });
}

export const useSwitchLanguage = () => {
    const formik = useFormikContext();
    const {setI18nContext} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const {lang: currentLanguage, envProps} = useContentEditorConfigContext();

    return useCallback(language => {
        const fields = sections && getFields(sections).filter(field => !field.readOnly);
        const dynamicFieldSets = getDynamicFieldSets(sections);

        const i18nValues = {
            values: {},
            validation: {}
        };
        const nonI18nValues = {
            values: {},
            validation: {}
        };
        const fieldsObj = fields.reduce((r, f) => Object.assign(r, {[f.name]: f}), {});
        // Add WIP to filtered names as it is not part of any section
        fieldsObj[Constants.wip.fieldName] = {i18n: false};

        setI18nContext(prev => {
            const previousValue = {
                ...formik.initialValues,
                ...prev.shared?.values,
                ...prev[language]?.values
            };

            fillValues(formik.values, previousValue, fieldsObj, i18nValues, nonI18nValues, dynamicFieldSets);
            const newValues = Object.keys(nonI18nValues.values).length > 0 ? {shared: nonI18nValues} : {};

            if (Object.keys(i18nValues.values).length > 0) {
                const validation = validate(sections)(formik.values);
                fillErrors(validation, fieldsObj, i18nValues);
                newValues[currentLanguage] = i18nValues;
            }

            if (prev?.memo?.systemNameLang === undefined && newValues?.shared?.values && Object.keys(newValues.shared.values).includes(Constants.systemName.name)) {
                newValues.memo = {
                    systemNameLang: currentLanguage
                };
            }

            return {
                ...prev,
                ...newValues
            };
        });

        if (envProps.switchLanguageCallback) {
            envProps.switchLanguageCallback(language, currentLanguage);
        }
    }, [envProps, formik, sections, setI18nContext, currentLanguage]);
};
