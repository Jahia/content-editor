import React, {useState} from 'react';
import {LanguageSwitcher} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect} from 'formik';
import {EditPanelDialogConfirmation} from '../EditPanelDialogConfirmation';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import envSwitchLanguages from './EditPanelLanguageSwitcher.env';

const EditPanelLanguageSwitcher = ({siteInfo, formik}) => {
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang} = contentEditorConfigContext;
    const [dialogConfirmation, setDialogConfirmation] = useState({open: false, lang: lang});

    const switchLanguage = language => {
        const envSwitchLanguage = envSwitchLanguages[contentEditorConfigContext.env];
        if (envSwitchLanguage) {
            envSwitchLanguage(language, contentEditorConfigContext);
        }

        // Switch edit mode linker language
        window.parent.authoringApi.switchLanguage(language);
    };

    return (
        <>
            <LanguageSwitcher lang={lang}
                              languages={siteInfo.languages}
                              color="primary"
                              onSelectLanguage={language => {
                                  if (language !== lang) {
                                      if (formik.dirty) {
                                          setDialogConfirmation({open: true, lang: language});
                                      } else {
                                          switchLanguage(language);
                                      }
                                  }
                              }}
            />

            <EditPanelDialogConfirmation
                open={dialogConfirmation.open}
                titleKey="content-editor:label.contentEditor.switchLanguage.dialog.title"
                formik={formik}
                actionCallback={() => switchLanguage(dialogConfirmation.lang)}
                onCloseDialog={() => setDialogConfirmation({open: false})}
            />
        </>
    );
};

EditPanelLanguageSwitcher.propTypes = {
    siteInfo: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

EditPanelLanguageSwitcher.displayName = 'EditPanelLanguageSwitcher';

export default compose(
    connect
)(EditPanelLanguageSwitcher);
