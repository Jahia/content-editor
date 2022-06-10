import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Button} from '@jahia/moonstone';
import {DisplayActions} from '@jahia/ui-extender';

import {Typography} from '@jahia/design-system-kit';

import {SearchInput} from './Search/Search';
import {List, Thumbnail} from './Views';
import {getButtonRenderer} from '~/utils/getButtonRenderer';
import clsx from 'clsx';

const styles = theme => ({
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '10px'
    },
    modalMain: {
        flex: '1 0 0'
    },
    searchInput: {
        flexGrow: 0.6
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${theme.spacing.unit * 4} ${theme.spacing.unit * 4} ${theme.spacing.unit * 4}`,
        backgroundColor: theme.palette.ui.epsilon,
        marginTop: `${theme.spacing.unit * 4}`
    },
    actionsJahiaAction: {
        '& svg': {
            color: theme.palette.font.gamma
        }
    }
});

const ViewMapper = {
    List,
    Thumbnail
};

const ButtonRenderer = getButtonRenderer({
    defaultButtonProps: {
        size: 'big',
        variant: 'ghost'
    }
});

const MainPanelCmp = ({
    classes,
    t,
    pickerConfig,
    lang,
    uilang,
    nodeTreeConfigs,
    initialSelectedItem,
    selectedPath,
    setSelectedPath,
    searchTerms,
    handleSearchChange,
    onItemSelection,
    onCloseDialog,
    selectedItem,
    setSelectedItem
}) => {
    const selectElement = () => {
        if (selectedItem) {
            // Todo: BACKLOG-12581 - Multiple is not supported yet in pickers. Always return a single value.
            onItemSelection(Array.isArray(selectedItem) ? selectedItem[0] : selectedItem);
        } else {
            onCloseDialog();
        }
    };

    const isElementSelected = !(selectedItem && selectedItem.length !== 0);
    const initialItemHasChanged = initialSelectedItem && selectedItem !== undefined;

    const PickerDialogContent = ViewMapper[pickerConfig.picker.PickerDialog.view];

    const isPickerTypeFiles = nodeTreeConfigs[0].type === 'files';

    return (
        <>
            <header className={classes.modalHeader}>
                <Typography variant="delta" color="alpha">
                    {t(pickerConfig.picker.PickerDialog.dialogTitle(isPickerTypeFiles))}
                </Typography>
                <SearchInput
                    selectedPath={selectedPath}
                    placeholder={t(pickerConfig.picker.PickerDialog.searchPlaceholder())}
                    className={classes.searchInput}
                    language={lang}
                    onChange={handleSearchChange}
                />
            </header>
            <main className={clsx(classes.modalMain, 'flexCol_nowrap')}>
                <PickerDialogContent
                    pickerConfig={pickerConfig}
                    setSelectedItem={setSelectedItem}
                    selectedPath={selectedPath}
                    setSelectedPath={setSelectedPath}
                    initialSelection={initialSelectedItem ? [initialSelectedItem] : []}
                    lang={lang}
                    uilang={uilang}
                    searchTerms={searchTerms}
                    onThumbnailDoubleClick={onItemSelection}
                />
            </main>

            <div className={classes.actions}>
                <Button
                    data-sel-picker-dialog-action="cancel"
                    size="big"
                    label={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                    onClick={onCloseDialog}
                />
                <div className={classes.actionsJahiaAction}>
                    <DisplayActions path={selectedPath}
                                    target="pickerDialogAction"
                                    render={ButtonRenderer}
                    />
                </div>
                <Button
                    data-sel-picker-dialog-action="done"
                    disabled={!(!isElementSelected || initialItemHasChanged)}
                    color="accent"
                    size="big"
                    label={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                    onClick={selectElement}
                />
            </div>
        </>
    );
};

MainPanelCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    pickerConfig: PropTypes.shape({
        picker: PropTypes.shape({
            PickerDialog: PropTypes.shape({
                view: PropTypes.string.isRequired,
                dialogTitle: PropTypes.func.isRequired,
                searchPlaceholder: PropTypes.func.isRequired
            }).isRequired
        }).isRequired,
        selectableTypesTable: PropTypes.arrayOf(PropTypes.string),
        showOnlyNodesWithTemplates: PropTypes.bool,
        searchSelectorType: PropTypes.string,
        displayTree: PropTypes.bool
    }).isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    initialSelectedItem: PropTypes.string,
    selectedPath: PropTypes.string,
    setSelectedPath: PropTypes.func.isRequired,
    selectedItem: PropTypes.arrayOf(PropTypes.object),
    setSelectedItem: PropTypes.func.isRequired,
    searchTerms: PropTypes.string,
    handleSearchChange: PropTypes.func.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

export const MainPanel = withStyles(styles)(MainPanelCmp);
