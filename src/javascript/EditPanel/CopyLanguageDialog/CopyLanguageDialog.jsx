import React, {useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent
} from '@material-ui/core';
import {Button} from '@jahia/design-system-kit';
import {Warning} from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {Typography} from '@jahia/design-system-kit';
import {Dropdown} from '@jahia/moonstone';
import classes from './CopyLanguageDialog.scss';

export const CopyLanguageDialog = ({
    language,
    availableLanguages,
    isOpen,
    onCloseDialog,
    formik
}) => {
    const {t} = useTranslation();
    const handleCancel = () => {
        onCloseDialog();
    };

    const defaultOption = {
        label: t('content-editor:label.contentEditor.edit.action.copyLanguage.defaultValue'),
        value: 'void'};

    const [currentOption, setCurrentOption] = useState(defaultOption);

    const handleOnChange = (e, item) => {
        setCurrentOption(item);

        return true;
    };

    const handleApply = () => {
        onCloseDialog();
        // TODO BACKLOG-12538 copy the values from a language to another one
        // eslint-disable-next-line no-unused-vars
        const {submitForm} = formik;
    };

    let isApplyDisabled = defaultOption.value === currentOption.value;

    return (
        <Dialog fullWidth
                aria-labelledby="alert-dialog-slide-title"
                open={isOpen}
                maxWidth="lg"
                onClose={onCloseDialog}
        >
            <DialogTitle id="dialog-language-title">
                <Typography className={classes.dialogTitle}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.dialogTitle')}
                </Typography>
                <Typography className={classes.dialogSubTitle}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.dialogSubTitle')}
                </Typography>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <div className={classes.container}>
                    <div>
                        <Typography className={classes.label}>
                            {t('content-editor:label.contentEditor.edit.action.copyLanguage.currentLanguage')}
                        </Typography>
                    </div>
                    <div className={classes.language}>
                        <Typography>
                            {language}
                        </Typography>
                    </div>
                    <div>
                        <Typography className={classes.label}>
                            {t('content-editor:label.contentEditor.edit.action.copyLanguage.listLabel')}
                        </Typography>
                    </div>
                    <div>
                        <Dropdown
                            label={currentOption.label}
                            value={currentOption.value}
                            size="medium"
                            isDisabled={false}
                            maxWidth="120px"
                            data={[defaultOption].concat(availableLanguages.map(element => {
                                return {value: element.language,
                                    label: element.displayName};
                            }))}
                            onChange={handleOnChange}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Typography className={classes.dialogSubTitle}>
                    <Warning className={classes.warningIcon}/> {t('content-editor:label.contentEditor.edit.action.copyLanguage.bottomText')}
                </Typography>
                <Button variant="secondary" onClick={handleCancel}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.btnCancel')}
                </Button>
                <Button variant="primary" disabled={isApplyDisabled} onClick={handleApply}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.btnApply')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CopyLanguageDialog.propTypes = {
    language: PropTypes.string.isRequired,
    availableLanguages: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formik: PropTypes.object.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

export default CopyLanguageDialog;
