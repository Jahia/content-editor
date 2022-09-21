import React, {useState} from 'react';
import PropTypes from 'prop-types';
import css from './RightPanel.scss';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {Button, Typography} from '@jahia/moonstone';
import {shallowEqual, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import ContentLayout from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout';
import clsx from 'clsx';
import {DisplayAction, DisplayActions, registry} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
import {SelectionCaption, SelectionTable} from './PickerSelection';
import {Search} from './Search';
import {PickerSiteSwitcher} from '~/SelectorTypes/Picker';
import {jcontentUtils} from '@jahia/jcontent';

const ButtonRenderer = getButtonRenderer({defaultButtonProps: {variant: 'ghost'}});

const RightPanel = ({pickerConfig, accordionItemProps, onClose, onItemSelection}) => {
    const {selection, mode, path} = useSelector(state => ({
        path: state.contenteditor.picker.path,
        selection: state.contenteditor.picker.selection,
        mode: state.contenteditor.picker.mode
    }), shallowEqual);
    const selectionExpanded = useState(false);
    const {t} = useTranslation('content-editor');

    const selectElement = () => {
        if (selection) {
            onItemSelection(selection);
        } else {
            onClose();
        }
    };

    const accordionItem = jcontentUtils.getAccordionItem(registry.get('accordionItem', mode), accordionItemProps);
    const viewSelector = accordionItem?.tableConfig?.viewSelector;
    const actionsTarget = accordionItem?.actionsTarget || 'content-editor/pickers/' + mode + '/header-actions';

    return (
        <div className="flexFluid flexCol_nowrap">
            <header className={clsx('flexCol_nowrap', css.header)}>
                <Typography variant="heading">{t(pickerConfig.pickerDialog.dialogTitle)}</Typography>
                <div className={clsx('flexRow_nowrap', 'alignCenter', css.headerActions)}>
                    {!jcontentUtils.booleanValue(pickerConfig.pickerDialog.displayTree) && jcontentUtils.booleanValue(pickerConfig.pickerDialog.displaySiteSwitcher) && <PickerSiteSwitcher pickerConfig={pickerConfig} accordionItemProps={accordionItemProps}/>}
                    {mode !== '' && jcontentUtils.booleanValue(pickerConfig.pickerDialog.displaySearch) && <Search pickerConfig={pickerConfig}/>}
                    <div className="flexFluid"/>
                    <DisplayActions target={actionsTarget} render={ButtonRenderer} path={path}/>
                    <DisplayAction actionKey="refresh" render={ButtonRenderer}/>
                    {viewSelector}
                </div>
            </header>
            <div className={clsx('flexFluid', 'flexCol_nowrap', css.body)}>
                {mode !== '' && <ContentLayout pickerConfig={pickerConfig} accordionItemProps={accordionItemProps}/>}
            </div>

            <SelectionTable selection={selection} expanded={selectionExpanded} pickerConfig={pickerConfig}/>
            <footer className={clsx('flexRow', 'alignCenter', css.footer)}>
                <SelectionCaption selection={selection} pickerConfig={pickerConfig} expanded={selectionExpanded}/>
                <div className={clsx('flexRow', css.actions)}>
                    <Button
                        data-sel-picker-dialog-action="cancel"
                        size="big"
                        label={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                        onClick={onClose}
                    />
                    <Button
                        data-sel-picker-dialog-action="done"
                        disabled={selection.length === 0}
                        color="accent"
                        size="big"
                        label={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                        onClick={selectElement}
                    />
                </div>
            </footer>
        </div>
    );
};

RightPanel.propTypes = {
    pickerConfig: configPropType.isRequired,
    accordionItemProps: PropTypes.object,
    onItemSelection: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default RightPanel;
