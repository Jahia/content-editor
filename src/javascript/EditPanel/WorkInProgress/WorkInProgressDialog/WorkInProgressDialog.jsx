import React, {useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent
} from '@material-ui/core';
import {Button, Typography/* TODO BACKLOG-12915 , Apps, Check */} from '@jahia/moonstone';
import {Checkbox} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import classes from './WorkInProgressDialog.scss';

export const WorkInProgressDialog = ({
    isOpen,
    onCloseDialog,
    isWipContent,
    onApply
}) => {
    const {t} = useTranslation();

    const [isWip, setIsWip] = useState(isWipContent);

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
                                  value={isWip}
                                  checked={isWip}
                                  onChange={event => {
                                      setIsWip(event.target.checked);
                                  }}
                        />
                    </div>
                    <div>
                        <Typography className={classes.label}>
                            {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxLabel')}
                        </Typography>
                        <Typography className={classes.label}>
                            {t('content-editor:label.contentEditor.edit.action.workInProgress.checkboxSubLabel')}
                        </Typography>
                    </div>
                </div>
            </DialogContent>
            <DialogActions className={classes.actions}>
                {/* TODO BACKLOG-12915 add icon={<Apps/>} on button below */}
                <Button
                        label={t('content-editor:label.contentEditor.edit.action.workInProgress.btnCancel')}
                        onClick={handleCancel}/>
                {/* TODO BACKLOG-12915 add icon={<Check/>} on button below */}
                <Button
                        label={t('content-editor:label.contentEditor.edit.action.copyLanguage.btnApply')}
                        color="accent"
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
    isWipContent: PropTypes.bool.isRequired
};

export default WorkInProgressDialog;
