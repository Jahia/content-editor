import {SaveErrorModal} from './SaveErrorModal';

const setErrorFieldTouched = (errorsFields, setTouched) => {
    const fieldsTouched = Object.keys(errorsFields).reduce((touched, field) => {
        return {
            ...touched,
            [field]: true
        };
    }, {});
    return setTouched(fieldsTouched, false);
};

export const validateForm = async ({setTouched, validateForm}, i18nContext, sections, language, siteInfo, componentRenderer) => {
    const errors = await validateForm();
    // SetEach values touched to display errors if there is so.
    // If no error, form will be reset after submition
    await setErrorFieldTouched(errors, setTouched);

    // If form has errors
    const nbOfErrors = Object.keys(errors).length;

    const i18nErrors = Object.keys(i18nContext)
        .filter(l => l !== 'shared' && l !== 'memo')
        .filter(l => Object.keys(i18nContext[l].validation).length > 0)
        .reduce((r, l) => Object.assign(r, {[l]: i18nContext[l].validation}), {});

    const fields = [];
    sections.forEach(section => {
        section.fieldSets.forEach(fieldSet => {
            fieldSet.fields.forEach(field => {
                fields.push(field);
            });
        });
    });

    delete i18nErrors[language];
    Object.keys(errors)
        .map(k => fields.find(f => f.name === k))
        .forEach(f => {
            const langKey = f.i18n ? language : 'shared';
            i18nErrors[langKey] = i18nErrors[langKey] || {};
            i18nErrors[langKey][f.name] = errors[f.name];
        });

    const nbOfI18nErrors = Object.keys(i18nErrors).length;

    if (nbOfI18nErrors > 0) {
        const onClose = () => {
            componentRenderer.destroy('SaveErrorModal');
        };

        componentRenderer.render('SaveErrorModal', SaveErrorModal, {open: true, fields, siteInfo, i18nErrors, onClose});
    }

    return {
        errors: nbOfErrors > 0 ? errors : null,
        i18nErrors: nbOfI18nErrors > 0 ? i18nErrors : null
    };
};

