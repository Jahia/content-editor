import React from 'react';
import PropTypes from 'prop-types';
import {cePickerSetTableViewMode} from '~/SelectorTypes/Picker/Picker2.redux';
import css from './RightPanel.scss';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {Button, Typography} from '@jahia/moonstone';
import {shallowEqual, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import ContentLayout from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout';

const ViewModeSelector = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ViewModeSelector})));

const viewModeSelectorProps = {
    selector: state => ({
        mode: state.contenteditor.picker.mode.replace('picker-', ''),
        viewMode: state.contenteditor.picker.tableView.viewMode
    }),
    setTableViewModeAction: mode => cePickerSetTableViewMode(mode)
};

const RightPanel = ({pickerConfig, onClose, onItemSelection}) => {
    const {selection} = useSelector(state => ({selection: state.contenteditor.picker.selection}), shallowEqual);
    const {t} = useTranslation('content-editor');

    return (
        <div className={css.panel}>
            <ViewModeSelector {...viewModeSelectorProps}/>
            <ContentLayout pickerConfig={pickerConfig}/>
            <div className={css.actions}>
                <div className={css.actionCaption}>
                    <Typography variant="caption">{t('Non-selectable items are not listed in this view')}</Typography>
                </div>
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
                    onClick={() => onItemSelection(selection[0].uuid)}
                />
            </div>
        </div>
    );
};

RightPanel.propTypes = {
    pickerConfig: configPropType.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default RightPanel;
