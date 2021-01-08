import React, {useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent
} from '@material-ui/core';
import {Warning} from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {Dropdown, Typography, Button} from '@jahia/moonstone';
import classes from './CopyLanguageDialog.scss';
import {useApolloClient} from '@apollo/react-hooks';
import {FormQuery} from '~/Edit/EditForm.gql-queries';
import {getI18nFieldAndValues} from '~/Edit/copyLanguage/copyLanguage.utils';
import {Constants} from '~/ContentEditor.constants';
export const CopyLanguageDialog = ({
    language,
    availableLanguages,
    isOpen,
    onCloseDialog,
    formik,
    uuid
}) => {
    const client = useApolloClient();

    const getDataFromSelectedLanguage = async language => {
        let variables = {
            uilang: language,
            language: language,
            uuid: uuid,
            writePermission: `jcr:modifyProperties_default_${language}`,
            childrenFilterTypes: Constants.childrenFilterTypes
        };

        let formAndData = await client.query({query: FormQuery, variables: variables});

        return getI18nFieldAndValues(formAndData);
    };

    const {t} = useTranslation('content-editor');
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
        getDataFromSelectedLanguage(currentOption.value).then(data => {
            data.forEach(value => {
                formik.setFieldValue(value.definition.declaringNodeType.name + '_' + value.name, value.multiple ? value.values : value.value);
            });
        });

        onCloseDialog();
    };

    let isApplyDisabled = defaultOption.value === currentOption.value;

    return (
        <Dialog fullWidth
                aria-labelledby="alert-dialog-slide-title"
                open={isOpen}
                maxWidth="sm"
                onClose={onCloseDialog}
        >
            <DialogTitle id="dialog-language-title">
                <Typography isUpperCase variant="heading" weight="bold" className={classes.dialogTitle}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.dialogTitle')}
                </Typography>
                <Typography variant="subheading" className={classes.dialogSubTitle}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.dialogSubTitle')}
                </Typography>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography className={classes.copyFromLabel}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.listLabel')}
                </Typography>
                <Dropdown
                    className={classes.language}
                    label={currentOption.label}
                    value={currentOption.value}
                    size="medium"
                    isDisabled={false}
                    maxWidth="120px"
                    data={[defaultOption].concat(availableLanguages.filter(element => element.displayName !== language).map(element => {
                        return {
                            value: element.language,
                            label: element.displayName
                        };
                    }))}
                    onChange={handleOnChange}
                />
                <Typography className={classes.label}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.currentLanguage')}
                </Typography>
                <Typography>{language}</Typography>
            </DialogContent>
            <DialogActions>
                <Typography className={classes.warningText}>
                    <Warning className={classes.warningIcon}/> {t('content-editor:label.contentEditor.edit.action.copyLanguage.bottomText')}
                </Typography>
                <Button
                    size="big"
                    color="default"
                    label={t('content-editor:label.contentEditor.edit.action.copyLanguage.btnCancel')}
                    onClick={handleCancel}
                />
                <Button
                    size="big"
                    color="accent"
                    label={t('content-editor:label.contentEditor.edit.action.copyLanguage.btnApply')}
                    disabled={isApplyDisabled}
                    onClick={handleApply}
                />
            </DialogActions>
        </Dialog>
    );
};

CopyLanguageDialog.propTypes = {
    language: PropTypes.string.isRequired,
    availableLanguages: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formik: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

export default CopyLanguageDialog;
