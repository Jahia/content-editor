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

    const switchLanguage = (language, createdNodeUuid) => {
        const envSwitchLanguage = envSwitchLanguages[contentEditorConfigContext.env];
        if (envSwitchLanguage) {
            envSwitchLanguage(language, contentEditorConfigContext, createdNodeUuid);
        }

        // Switch edit mode linker language
        if (window.top.authoringApi.switchLanguage) {
            window.top.authoringApi.switchLanguage(language);
        }
    };

    return (
        <>
            <LanguageSwitcher lang={lang}
                              languages={siteInfo.languages}
                              color="default"
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
                actionCallback={createdNodeUuid => switchLanguage(dialogConfirmation.lang, createdNodeUuid)}
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
