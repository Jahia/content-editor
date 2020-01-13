import React, {useState} from 'react';
import {LanguageSwitcher} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import {connect as connectReactRedux} from 'react-redux';
import {cmGoto} from '~/ContentManager.redux-actions';
import {EditPanelDialogConfirmation} from '../EditPanelDialogConfirmation';
import {resetLockEditorId} from '~/Lock/LockUtils';

const EditPanelLanguageSwitcher = ({lang, siteInfo, onSelectLanguage, formik}) => {
    const [dialogConfirmation, setDialogConfirmation] = useState({open: false, lang: lang});

    const switchLanguage = language => {
        // Reset lock id, used because the lock should be refreshed with a new ID,
        // because the language switcher is not reloading the complete page
        resetLockEditorId();

        // Select callback from CMM
        onSelectLanguage(language);

        // Switch edit mode linker language
        window.parent.authoringApi.switchLanguage(language);
    };

    return (
        <>
            <LanguageSwitcher lang={lang}
                              languages={siteInfo.languages}
                              color="inverted"
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

const mapStateToProps = state => ({
    lang: state.language
});

const mapDispatchToProps = dispatch => ({
    onSelectLanguage: language => {
        dispatch(cmGoto({language}));
    }
});

EditPanelLanguageSwitcher.propTypes = {
    lang: PropTypes.string.isRequired,
    siteInfo: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    onSelectLanguage: PropTypes.func.isRequired
};

EditPanelLanguageSwitcher.displayName = 'EditPanelLanguageSwitcher';

export default compose(
    connect,
    connectReactRedux(mapStateToProps, mapDispatchToProps)
)(EditPanelLanguageSwitcher);
