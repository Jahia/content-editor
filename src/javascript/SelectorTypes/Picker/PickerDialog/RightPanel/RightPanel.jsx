import React from 'react';
import PropTypes from 'prop-types';
import {
    cePickerSetSearchTerm,
    cePickerSetSearchContext
} from '~/SelectorTypes/Picker/Picker2.redux';
import css from './RightPanel.scss';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import {Button, Dropdown, SearchContextInput, Typography} from '@jahia/moonstone';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import ContentLayout from '~/SelectorTypes/Picker/PickerDialog/RightPanel/ContentLayout';
import clsx from 'clsx';
import {DisplayAction, registry} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';
import SelectionCaption from './SelectionCaption';

const ButtonRenderer = getButtonRenderer({defaultButtonProps: {variant: 'ghost'}});

const RightPanel = ({pickerConfig, onClose, onItemSelection}) => {
    const dispatch = useDispatch();
    const {selection, mode, searchTerm, searchContext, currentPath, currentSite} = useSelector(state => ({
        selection: state.contenteditor.picker.selection,
        mode: state.contenteditor.picker.mode,
        searchTerm: state.contenteditor.picker.searchTerm,
        searchContext: state.contenteditor.picker.searchContext,
        currentPath: state.contenteditor.picker.path,
        currentSite: state.contenteditor.picker.site
    }), shallowEqual);
    const {t} = useTranslation('content-editor');

    const selectElement = () => {
        if (selection) {
            // Todo: BACKLOG-12581 - Multiple is not supported yet in pickers. Always return a single value.
            onItemSelection(selection);
        } else {
            onClose();
        }
    };

    const viewSelector = registry.get('accordionItem', mode)?.viewSelector;

    const handleChangeTerms = e => {
        console.log('Updating search terms', e.target.value);
        dispatch(cePickerSetSearchTerm(e.target.value));
    };

    const handleClearTerms = e => {
        console.log('Clearing search terms', e.target.value);
        dispatch(cePickerSetSearchTerm(''));
        dispatch(cePickerSetSearchContext(currentPath));
    };

    const handleChangeContext = (e, item) => {
        console.log('Updating search context', item.value);
        dispatch(cePickerSetSearchContext(item.value));
    };

    const getSearchContextData = () => {
        return pickerConfig.pickerDialog.searchContextOptions(currentPath, currentSite, t).filter((value, index, array) => array.findIndex(value1 => value1.value === value.value) === index);
    };

    const getCurrentSearchContext = () => {
        return getSearchContextData().find(value => value.value === (searchContext === '' ? currentPath : searchContext));
    };

    return (
        <div className="flexFluid flexCol_nowrap">
            <header className={clsx('flexCol_nowrap', css.header)}>
                <Typography variant="heading">Select content</Typography>
                <div className={clsx('flexRow_nowrap', 'alignCenter', css.headerActions)}>
                    <SearchContextInput
                        searchContext={<Dropdown data={getSearchContextData()}
                                                 value={getCurrentSearchContext().value}
                                                 label={getCurrentSearchContext().label}
                                                 icon={getCurrentSearchContext().iconStart}
                                                 onChange={handleChangeContext}/>}
                        size="big"
                        value={searchTerm}
                        className={css.searchInput}
                        onChange={e => handleChangeTerms(e)}
                        onClear={e => handleClearTerms(e)}
                    />
                    <div className="flexFluid"/>
                    <DisplayAction actionKey="pageComposer" render={ButtonRenderer} path="/"/>

                    {viewSelector}
                </div>
            </header>
            <div className={clsx('flexFluid', 'flexCol_nowrap', css.body)}>
                <ContentLayout pickerConfig={pickerConfig}/>
            </div>
            <footer className={clsx('flexRow', 'alignCenter', css.footer)}>
                <SelectionCaption selection={selection} pickerConfig={pickerConfig}/>
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
    onItemSelection: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default RightPanel;
