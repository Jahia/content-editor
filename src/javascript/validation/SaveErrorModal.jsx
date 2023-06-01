import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Button, Typography, Warning} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {getCapitalized} from '~/utils';
import styles from './SaveErrorModal.scss';

export const SaveErrorModal = ({i18nErrors, fields, open, siteInfo, onClose}) => {
    const {t} = useTranslation('content-editor');
    const langs = Object.keys(i18nErrors).sort();

    const nbOfErrors = Object.keys(i18nErrors).reduce((c, lang) => c + Object.keys(i18nErrors[lang]).length, 0);

    const message = (siteInfo.languages.length === 1) ? (
        <Typography>
            {Object.keys(i18nErrors).reduce((p, k) => [...p, ...Object.keys(i18nErrors[k])], []).map(k => fields.find(f => f.name === k).displayName).join(',')}
        </Typography>
    ) : (
        <ul>
            {i18nErrors.shared && (
                <Typography component="li">
                    {t('content-editor:label.contentEditor.edit.sharedLanguages')} :&nbsp;
                    {
                        Object.keys(i18nErrors.shared)
                            .map(k => fields.find(f => f.name === k).displayName)
                            .join(',')
                    }
                </Typography>
            )}
            {langs.filter(lang => lang !== 'shared').map(lang => (
                <Typography key={lang} component="li">
                    {getCapitalized(siteInfo.languages.find(l => l.language === lang).displayName)} :&nbsp;
                    {
                        Object.keys(i18nErrors[lang])
                            .map(k => fields.find(f => f.name === k).displayName)
                            .join(',')
                    }
                </Typography>
            ))}
        </ul>
    );

    return (
        <Dialog maxWidth="md"
                classes={{paper: styles.dialog}}
                open={open}
                aria-labelledby="dialog-errorBeforeSave"
                data-sel-role="dialog-errorBeforeSave"
                onClose={onClose}
        >
            <DialogTitle id="dialog-errorBeforeSave" className={styles.dialogTitle}>
                <Warning size="big" color="yellow" className={styles.icon}/>
                <Typography variant="heading">
                    {t('content-editor:label.contentEditor.edit.action.save.validation.modalTitle')}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    <Typography weight="semiBold">
                        {t('content-editor:label.contentEditor.edit.action.save.validation.modalMessage', {count: nbOfErrors})}
                    </Typography>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    size="big"
                    color="accent"
                    data-sel-role="content-type-dialog-cancel"
                    label={t('content-editor:label.contentEditor.edit.action.save.validation.modalButton')}
                    onClick={onClose}
                />
            </DialogActions>
        </Dialog>
    );
};

SaveErrorModal.propTypes = {
    i18nErrors: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    siteInfo: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

