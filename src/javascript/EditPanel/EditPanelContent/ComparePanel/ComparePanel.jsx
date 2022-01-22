import React, {useState} from 'react';
import {Button, Dropdown} from '@jahia/moonstone';
import {useFormDefinition} from '~/FormDefinitions';
import {Constants} from '~/ContentEditor.constants';
import {adaptEditFormData} from '~/Edit/Edit.adapter';
import {ChildrenSection} from '~/EditPanel/EditPanelContent/FormBuilder/ChildrenSection';
import {Section} from '~/EditPanel/EditPanelContent/FormBuilder/Section';
import {FormQuery} from '~/Edit/EditForm.gql-queries';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {useTranslation} from 'react-i18next';
import {ProgressOverlay} from '@jahia/react-material';
import {useSiteInfo} from '@jahia/data-helper';
import * as PropTypes from 'prop-types';

const ComparePanel = ({setFieldValue, switchDisplay}) => {
    // Load data
    const {t} = useTranslation('content-editor');
    const [lang, setLang] = useState('en');
    const [workspace, setWorkspace] = useState('EDIT');
    const mode = 'compare';

    const {uuid, uilang, contentType, site} = useContentEditorConfigContext();

    const workspaces = [{
        label: 'live content',
        value: 'LIVE'
    }, {
        label: 'staging content',
        value: 'EDIT'
    }];

    const formQueryParams = {
        uuid,
        workspace,
        language: lang,
        uilang: Constants.supportedLocales.includes(uilang) ? uilang : Constants.defaultLocale,
        primaryNodeType: contentType,
        writePermission: `jcr:modifyProperties_default_${lang}`,
        childrenFilterTypes: Constants.childrenFilterTypes
    };

    // Load data and transform it
    const {loading, error, data: formDefinition} = useFormDefinition(FormQuery, formQueryParams, adaptEditFormData, t);
    const siteInfoResult = useSiteInfo({
        siteKey: site,
        displayLanguage: lang
    });
    if (error) {
        throw error;
    }

    if (siteInfoResult.error) {
        console.error('Error when fetching data: ' + siteInfoResult.error);
        return null;
    }

    if (loading || siteInfoResult.loading) {
        return <ProgressOverlay/>;
    }

    var langLabel = '';
    const languages = siteInfoResult.siteInfo.languages.map(item => {
        const capitalizedDisplayName = item.displayName.charAt(0).toUpperCase() + item.displayName.slice(1);

        if (item.language === lang) {
            langLabel = capitalizedDisplayName;
        }

        return {label: capitalizedDisplayName, value: item.language};
    });

    const {sections, initialValues: values} = formDefinition;

    // Custom formik
    const formik = {
        values,
        errors: {},
        touched: {},
        setFieldValue: () => {
        },
        setFieldTouched: () => {
        },
        handleChange: () => {
        },
        copyValue: fieldName => {
            setFieldValue(fieldName, values[fieldName], true);
        }

    };

    // Inject actions to copy values
    return (
        <div>
            <Button
                label="Show Preview"
                onClick={() => switchDisplay()}
            />
            <Dropdown
                data-cm-role="language-switcher"
                data={languages}
                value={lang}
                label={langLabel}
                size="small"
                onChange={(e, language) => {
                    setLang(language.value);
                }}
            />
            <Dropdown
                data-cm-role="workspace-switcher"
                data={workspaces}
                value={workspace}
                label={workspaces.find(ws => ws.value === workspace).label}
                size="small"
                onChange={(e, workspace) => {
                    setWorkspace(workspace.value);
                }}
            />
            <div>
                <section data-sel-mode={mode}>
                    {sections.filter(section => !section.hide).map(section => {
                        const displaySection = {
                            ...section,
                            fieldSets: section.fieldSets.map(fieldset => ({
                                ...fieldset,
                                fields: fieldset.fields.map(field => ({
                                    ...field,
                                    readOnly: true
                                }))
                            })).filter(fieldSet => fieldSet.activated && fieldSet.fields.length > 0)
                        };
                        return (
                            displaySection.isOrderingSection ?
                                <ChildrenSection
                                    key={section.displayName}
                                    section={displaySection}
                                    canAutomaticallyOrder={false}
                                    canManuallyOrder={false}
                                /> :
                                <Section key={displaySection.displayName} section={displaySection} formik={formik}/>
                        );
                    })}
                </section>
            </div>
        </div>
    );
};

ComparePanel.propTypes = {
    setFieldValue: PropTypes.func.isRequired,
    switchDisplay: PropTypes.func.isRequired
};

export default ComparePanel;
