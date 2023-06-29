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
import {replaceFragmentsInDocument} from '@jahia/data-helper';
import {GET_PICKER_NODE_UUID} from '~/SelectorTypes/Picker/PickerDialog/PickerDialog.gql-queries';
import {useQuery, useApolloClient} from '@apollo/react-hooks';

const ButtonRenderer = getButtonRenderer({defaultButtonProps: {variant: 'ghost'}});

const RightPanel = ({pickerConfig, isMultiple, accordionItemProps, lang, onClose, onItemSelection}) => {
    const client = useApolloClient();
    const {selection, mode, path, uilang} = useSelector(state => ({
        path: state.contenteditor.picker.path,
        selection: state.contenteditor.picker.selection,
        mode: state.contenteditor.picker.mode,
        uilang: state.uilang
    }), shallowEqual);
    const selectionExpanded = useState(false);
    const {t} = useTranslation('content-editor');

    const fragments = (pickerConfig?.selectionTable?.getFragments?.() || []);
    const selectionQuery = replaceFragmentsInDocument(GET_PICKER_NODE_UUID, fragments);

    const {data} = useQuery(selectionQuery, {
        variables: {
            uuids: selection,
            language: lang,
            uilang: uilang
        }
    });

    const nodes = data?.jcr?.nodesById || [];

    const selectElement = () => {
        if (nodes && nodes.length > 0) {
            onItemSelection(nodes);
        } else {
            onClose();
        }
    };

    const dblClickSelect = uuid => {
        client.query({
            query: selectionQuery,
            variables: {
                uuids: [uuid],
                language: lang,
                uilang: uilang
            },
            fetchPolicy: 'network-only'
        }).then(res => {
            const nodes = res?.data?.jcr?.nodesById;
            if (nodes && nodes.length > 0) {
                onItemSelection(nodes);
            }

            onClose();
        }).catch(e => {
            console.error('Failed to select node', e);
        });
    };

    const accordionItem = jcontentUtils.getAccordionItem(registry.get('accordionItem', mode), accordionItemProps);
    let viewSelector = accordionItem?.tableConfig?.viewSelector;
    if (typeof viewSelector === 'function') {
        viewSelector = viewSelector({pickerConfig});
    }

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
                {mode !== '' && <ContentLayout pickerConfig={pickerConfig} isMultiple={isMultiple} accordionItemProps={accordionItemProps} dblClickSelect={dblClickSelect}/>}
            </div>

            <SelectionTable selection={nodes} expanded={selectionExpanded} pickerConfig={pickerConfig}/>
            <footer className={clsx('flexRow', 'alignCenter', css.footer)}>
                <SelectionCaption selection={nodes} pickerConfig={pickerConfig} expanded={selectionExpanded} isMultiple={isMultiple}/>
                <div className={clsx('flexRow', css.actions)}>
                    <Button
                        data-sel-picker-dialog-action="cancel"
                        size="big"
                        label={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                        onClick={onClose}
                    />
                    <Button
                        data-sel-picker-dialog-action="done"
                        disabled={selection.length === 0 || (nodes && nodes.length === 0)}
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
    isMultiple: PropTypes.bool,
    accordionItemProps: PropTypes.object,
    lang: PropTypes.string,
    onItemSelection: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default RightPanel;
