import React, {useState} from 'react';
import {Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Radio} from '@material-ui/core';
import {Button, Check, Typography} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import styles from './WorkInProgressDialog.scss';
import {Constants} from '~/ContentEditor.constants';

export const WorkInProgressDialog = ({
    currentLanguage,
    isOpen,
    onCloseDialog,
    wipInfo,
    onApply,
    languages
}) => {
    const {t} = useTranslation('content-editor');

    const [wipStatus, setWipStatus] = useState(wipInfo.status !== Constants.wip.status.DISABLED);

    const [statusSelected, setStatusSelected] = useState(wipInfo.status);

    const [selectedLanguages, setSelectedLanguages] = useState(wipInfo.languages);

    const updateSelectedLanguage = (language, isToAdd) => {
        if (isToAdd) {
            setSelectedLanguages([
                ...selectedLanguages,
                language
            ]);
        } else {
            setSelectedLanguages(selectedLanguages.filter(selectedLanguage => selectedLanguage !== language));
        }
    };

    const handleLocalisedOrAllContent = event => {
        setStatusSelected(event.target.value);
        if (event.target.value === Constants.wip.status.ALL_CONTENT) {
            setSelectedLanguages([]);
        }
    };

    const handleCancel = () => {
        onCloseDialog();
    };

    const handleApply = () => {
        onApply({status: statusSelected, languages: selectedLanguages});
    };

    const isApplyDisabled = () => {
        return statusSelected === Constants.wip.status.LANGUAGES && selectedLanguages.length === 0;
    };

    const onChangeWip = event => {
        setWipStatus(event.target.checked);
        if (event.target.checked) {
            setSelectedLanguages([currentLanguage]);
            setStatusSelected(Constants.wip.status.LANGUAGES);
        } else {
            setSelectedLanguages([]);
            setStatusSelected(Constants.wip.status.DISABLED);
        }
    };

    return (
        <Dialog
            aria-labelledby="alert-dialog-slide-title"
            open={isOpen}
            maxWidth="sm"
            onClose={onCloseDialog}
        >
            <DialogTitle id="dialog-language-title">
                <Typography variant="heading" weight="bold" className={styles.dialogTitle}>
                    {t('content-editor:label.contentEditor.edit.action.workInProgress.dialogTitle')}
                </Typography>
                <Typography className={styles.dialogSubTitle}>
                    {t('content-editor:label.contentEditor.edit.action.workInProgress.dialogSubTitle')}
                    <a
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={window.contextJsParameters.config.wip}
                    >{t('content-editor:label.contentEditor.edit.action.workInProgress.clickHere')}
                    </a>
                </Typography>
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <div className={styles.container}>
                    <div>
                        <Checkbox
                            data-sel-role="WIP"
                            className={wipStatus ? styles.checkboxChecked : ''}
                            checked={wipStatus}
                            onChange={onChangeWip}
                        />
                    </div>
                    <div>
                        <Typography className={styles.label}>
                            {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxLabel')}
                        </Typography>

                        {!wipStatus &&
                        <Typography className={styles.label} variant="caption">
                            {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxSubLabel')}
                        </Typography>}
                    </div>
                </div>
                {wipStatus &&
                <div className={styles.radioButtonContainer}>
                    <div className={styles.radioButtonEntry}>
                        <Radio
                            disabled={!wipStatus}
                            checked={statusSelected === Constants.wip.status.LANGUAGES}
                            className={styles.radioButton}
                            value={Constants.wip.status.LANGUAGES}
                            onChange={handleLocalisedOrAllContent}
                        />
                        <Typography className={styles.label}>
                            {t('content-editor:label.contentEditor.edit.action.workInProgress.localizedPropertiesOnly')}
                        </Typography>
                    </div>
                    <div className={styles.languageSelectionContainer}>
                        {languages.map(language => {
                            return (
                                <div key={language.language}>
                                    <Checkbox
                                        disabled={!wipStatus || statusSelected !== Constants.wip.status.LANGUAGES}
                                        className={selectedLanguages.indexOf(language.language) > -1 ? styles.checkboxChecked : ''}
                                        value={language.language}
                                        checked={selectedLanguages.indexOf(language.language) > -1}
                                        onChange={event => {
                                            updateSelectedLanguage(language.language, event.target.checked);
                                        }}
                                    />
                                    <Typography className={styles.label}>
                                        {language.displayName}
                                    </Typography>
                                </div>
                            );
                        })}
                        <Typography className={styles.label} variant="caption">
                            {t('content-editor:label.contentEditor.edit.action.workInProgress.localizedPropertiesOnlySubText')}
                        </Typography>
                    </div>
                    <div className={styles.radioButtonEntry}>
                        <Radio
                            disabled={!wipStatus}
                            checked={statusSelected === Constants.wip.status.ALL_CONTENT}
                            className={styles.radioButton}
                            value={Constants.wip.status.ALL_CONTENT}
                            onChange={handleLocalisedOrAllContent}
                        />
                        <div>
                            <Typography className={styles.label}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.allContent')}
                            </Typography>
                            <Typography className={styles.subTextAllContent} variant="caption">
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.allContentSubText')}
                            </Typography>
                        </div>
                    </div>
                </div>}
            </DialogContent>
            <DialogActions className={styles.actions}>
                <Button
                    label={t('content-editor:label.contentEditor.edit.action.workInProgress.btnCancel')}
                    size="big"
                    onClick={handleCancel}/>
                <Button
                    icon={<Check/>}
                    size="big"
                    color="accent"
                    label={t('content-editor:label.contentEditor.edit.action.workInProgress.btnDone')}
                    disabled={isApplyDisabled()}
                    onClick={handleApply}/>
            </DialogActions>
        </Dialog>
    );
};

WorkInProgressDialog.propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    wipInfo: PropTypes.shape({
        status: PropTypes.oneOf(['DISABLED', 'ALL_CONTENT', 'LANGUAGES']),
        languages: PropTypes.array
    }).isRequired,
    languages: PropTypes.array.isRequired
};
