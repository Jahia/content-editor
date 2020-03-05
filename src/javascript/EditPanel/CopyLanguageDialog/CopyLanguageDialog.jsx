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
import {Dropdown, Typography} from '@jahia/moonstone';
import classes from './CopyLanguageDialog.scss';
import {useApolloClient} from '@apollo/react-hooks';
import {FormQuery} from '~/Edit/EditForm.gql-queries';
import {getI18nFieldAndValues} from '~/Edit/copyLanguage/copyLanguage.utils';
export const CopyLanguageDialog = ({
    language,
    availableLanguages,
    isOpen,
    onCloseDialog,
    formik,
    nodePath
}) => {
    const client = useApolloClient();

    const getDataFromSelectedLanguage = async language => {
        let variables = {
            uilang: language,
            language: language,
            path: nodePath
        };

        let formAndData = await client.query({query: FormQuery, variables: variables});

        return getI18nFieldAndValues(formAndData);
    };

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
        getDataFromSelectedLanguage(currentOption.value).then(data => {
            data.forEach(value => {
                formik.setFieldValue(value.name, value.multiple ? value.values : value.value);
            });
        });

        onCloseDialog();
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
                <Typography isUpperCase variant="heading" weight="bold" className={classes.dialogTitle}>
                    {t('content-editor:label.contentEditor.edit.action.copyLanguage.dialogTitle')}
                </Typography>
                <Typography variant="subheading" className={classes.dialogSubTitle}>
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
                            data={[defaultOption].concat(availableLanguages.filter(element => element.displayName !== language).map(element => {
                                return {value: element.language,
                                    label: element.displayName};
                            }))}
                            onChange={handleOnChange}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Typography className={classes.warningText}>
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
    nodePath: PropTypes.string.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

export default CopyLanguageDialog;
