import React, {useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Radio
} from '@material-ui/core';
import {Button, Typography} from '@jahia/moonstone';
import {Check} from '@jahia/moonstone/dist/icons';
import {Checkbox} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import classes from './WorkInProgressDialog.scss';

export const WorkInProgressDialog = ({
    isOpen,
    onCloseDialog,
    isWipContent,
    onApply,
    languages
}) => {
    const {t} = useTranslation();

    const [isWip, setIsWip] = useState(isWipContent);

    const [contentSelected, setContentSelected] = useState(null);

    const [selectedLanguages, setSelectedLanguages] = useState([]);

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
        setContentSelected(event.target.value);
        if (event.target.value === 'allContent') {
            setSelectedLanguages([]);
        }
    };

    const handleCancel = () => {
        onCloseDialog();
    };

    const handleApply = () => {
        onApply();
        // TODO BACKLOG-12845 Do it
    };

    const isApplyDisabled = () => {
        return isWipContent === isWip;
    };

    const onChangeWip = event => {
        setIsWip(event.target.checked);
        if (!event.target.checked) {
            setSelectedLanguages([]);
            setContentSelected(null);
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
                        <Checkbox className={classes.checkbox}
                                  checked={isWip}
                                  onChange={onChangeWip}
                        />
                    </div>
                    <div>
                        <Typography className={classes.label}>
                            {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxLabel')}
                        </Typography>

                        {!isWip &&
                            <Typography className={classes.label}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxSubLabel')}
                            </Typography>}
                        {isWip &&
                            <Typography className={classes.label}>
                                {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxSubLabelCannotBePublished')}
                            </Typography>}
                    </div>
                </div>
                {hasMultipleLanguages &&
                    <div className={classes.radioButtonContainer} disabled={!isWip}>
                        <div className={classes.radioButtonEntry}>
                            <Radio
                                    disabled={!isWip}
                                    checked={contentSelected === 'localizedProperties'}
                                    className={classes.radioButton}
                                    value="localizedProperties"
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
                                                disabled={!isWip || contentSelected !== 'localizedProperties'}
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
                                disabled={!isWip}
                                checked={contentSelected === 'allContent'}
                                className={classes.radioButton}
                                value="allContent"
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
    isWipContent: PropTypes.bool.isRequired,
    languages: PropTypes.array.isRequired
};

export default WorkInProgressDialog;
