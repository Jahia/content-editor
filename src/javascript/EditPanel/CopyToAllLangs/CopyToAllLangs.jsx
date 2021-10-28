import React, {useContext, useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent
} from '@material-ui/core';
import {Button, Typography} from '@jahia/moonstone';
import {ComponentRendererContext} from '@jahia/ui-extender';
import {getFullLanguageName} from '~/Edit/copyLanguage/copyLanguage.utils';
import {useTranslation} from 'react-i18next';
import {MultipleInput} from '~/DesignSystem/MultipleInput';
import classes from './CopyToAllLangs.scss';
import PropTypes from 'prop-types';

export default function CopyToAllLangs({render: Render, formik, field, ceContext, ...otherProps}) {
    const {render, destroy} = useContext(ComponentRendererContext);

    const {siteInfo, lang, nodeData} = ceContext;
    const openModal = () => {
        render('CopyToAllLangs', CopyToAllLangsComp, {
            isOpen: true,
            uuid: nodeData.uuid,
            language: getFullLanguageName(siteInfo.languages, lang),
            availableLanguages: siteInfo.languages,
            formik,
            onCloseDialog: () => destroy('CopyToAllLangs')
        });
    };

    return (
        <Render enabled={!formik.dirty} onClick={openModal} {...otherProps}/>
    );
}

CopyToAllLangs.propTypes = {
    render: PropTypes.func.isRequired,
    formik: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    ceContext: PropTypes.object.isRequired
};

function CopyToAllLangsComp({isOpen, onCloseDialog, availableLanguages}) {
    const {t} = useTranslation('content-editor');
    const options = availableLanguages.map(lang => ({
        label: lang.displayName, value: lang.language
    }));

    let [value, setValue] = useState([]);

    const onDropdownChange = sel => {
        setValue(sel);
    };

    const handleApply = () => {
        onCloseDialog();
    };

    return (
        <Dialog fullWidth
                aria-labelledby="alert-dialog-slide-title"
                open={isOpen}
                maxWidth="sm"
                onClose={onCloseDialog}
        >

            <DialogTitle id="dialog-language-title">
                <Typography isUpperCase variant="heading" weight="bold">
                    Copy to all languages
                </Typography>
            </DialogTitle>

            <DialogContent className={classes.dialogContent}>
                <Typography className={classes.copyFromLabel}>
                    select languages
                </Typography>

                <MultipleInput id="my-own-id"
                               options={options}
                               value={value}
                               // InputProps={{
                               //     'data-sel-content-editor-select-readonly': false,
                               //     'data-sel-content-editor-field-type': "MultipleChoicelist"
                               // }}
                               onChange={onDropdownChange}/>
            </DialogContent>

            <DialogActions>
                <Button size="big"
                        color="default"
                        label={t('content-editor:label.contentEditor.edit.action.copyLanguage.btnCancel')}
                        onClick={onCloseDialog}/>
                <Button size="big"
                        color="accent"
                        label={t('content-editor:label.contentEditor.edit.action.copyLanguage.btnApply')}
                        onClick={handleApply}/>
            </DialogActions>
        </Dialog>
    );
}

CopyToAllLangsComp.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    availableLanguages: PropTypes.array.isRequired
};
