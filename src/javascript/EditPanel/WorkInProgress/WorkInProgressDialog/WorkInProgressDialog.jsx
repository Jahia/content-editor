import React, {useState} from 'react';
import {Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Radio} from '@material-ui/core';
import {Button, Typography} from '@jahia/moonstone';
import {Check} from '@jahia/moonstone/dist/icons';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import classes from './WorkInProgressDialog.scss';
import {Constants} from '~/ContentEditor.constants';

export const WorkInProgressDialog = ({
    isOpen,
    onCloseDialog,
    wipInfo,
    onApply,
    languages
}) => {
    const {t} = useTranslation();

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
        return wipInfo.status === statusSelected && selectedLanguages.length === wipInfo.languages.length && selectedLanguages.every((value, index) => value === wipInfo.languages[index]);
    };

    const onChangeWip = event => {
        setWipStatus(event.target.checked);
        if (!event.target.checked) {
            setSelectedLanguages([]);
            setStatusSelected(Constants.wip.status.DISABLED);
        }
    };

    const hasMultipleLanguages = languages.length > 1;

    return (
        <Dialog
                aria-labelledby="alert-dialog-slide-title"
                open={isOpen}
                maxWidth="sm"
                onClose={onCloseDialog}
        >
            <DialogTitle id="dialog-language-title">
                <Typography isUpperCase variant="heading" weight="bold" className={classes.dialogTitle}>
                    {t('content-editor:label.contentEditor.edit.action.workInProgress.dialogTitle')}
                </Typography>
                <Typography className={classes.dialogSubTitle}>
                    {t('content-editor:label.contentEditor.edit.action.workInProgress.dialogSubTitle')} <a className={classes.link} target="_blank" rel="noopener noreferrer" href="https://academy.jahia.com/documentation/digital-experience-manager/7.3/functional/how-to-contribute-content#Work_in_Progress">{t('content-editor:label.contentEditor.edit.action.workInProgress.clickHere')}</a>
                </Typography>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <div className={classes.container}>
                    <div>
                        <Checkbox
                            data-sel-role="WIP"
                            className={classes.checkbox}
                            checked={wipStatus}
                            onChange={onChangeWip}
                        />
                    </div>
                    <div>
                        <Typography className={classes.label}>
                            {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxLabel')}
                        </Typography>

                        {!wipStatus &&
                            <Typography className={classes.label}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxSubLabel')}
                            </Typography>}
                        {wipStatus &&
                            <Typography className={classes.label}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxSubLabelCannotBePublished')}
                            </Typography>}
                    </div>
                </div>
                {hasMultipleLanguages &&
                    <div className={classes.radioButtonContainer} disabled={!wipStatus}>
                        <div className={classes.radioButtonEntry}>
                            <Radio
                                    disabled={!wipStatus}
                                    checked={statusSelected === Constants.wip.status.LANGUAGES}
                                    className={classes.radioButton}
                                    value={Constants.wip.status.LANGUAGES}
                                    onChange={handleLocalisedOrAllContent}
                                />
                            <Typography className={classes.label}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.localizedPropertiesOnly')}
                            </Typography>
                        </div>
                        <div className={classes.languageSelectionContainer}>
                            <Typography className={classes.label}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.localizedPropertiesOnlySubText')}
                            </Typography>
                            {languages.map(language => {
                                    return (
                                        <div key={language.language}>
                                            <Checkbox
                                                disabled={!wipStatus || statusSelected !== Constants.wip.status.LANGUAGES}
                                                className={classes.checkbox}
                                                value={language.language}
                                                checked={selectedLanguages.indexOf(language.language) > -1}
                                                onChange={event => {
                                                    updateSelectedLanguage(language.language, event.target.checked);
                                                }}
                                            />
                                            <Typography className={classes.label}>
                                                {language.displayName}
                                            </Typography>
                                        </div>

                                    );
                                })}
                        </div>
                        <div className={classes.radioButtonEntry}>
                            <Radio
                                disabled={!wipStatus}
                                checked={statusSelected === Constants.wip.status.ALL_CONTENT}
                                className={classes.radioButton}
                                value={Constants.wip.status.ALL_CONTENT}
                                onChange={handleLocalisedOrAllContent}
                                />
                            <Typography className={classes.label}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.allContent')}
                            </Typography>
                            <Typography className={classes.subTextAllContent}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.allContentSubText')}
                            </Typography>
                        </div>
                    </div>}
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Button
                    label={t('content-editor:label.contentEditor.edit.action.workInProgress.btnCancel')}
                    onClick={handleCancel}/>
                <Button
                    icon={<Check/>}
                    color="accent"
                    label={t('content-editor:label.contentEditor.edit.action.workInProgress.btnDone')}
                    disabled={isApplyDisabled()}
                    onClick={handleApply}/>
            </DialogActions>
        </Dialog>
    );
};

WorkInProgressDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    wipInfo: PropTypes.shape({
        status: PropTypes.oneOf(['DISABLED', 'ALL_CONTENT', 'LANGUAGES']),
        languages: PropTypes.array
    }).isRequired,
    languages: PropTypes.array.isRequired
};

export default WorkInProgressDialog;
