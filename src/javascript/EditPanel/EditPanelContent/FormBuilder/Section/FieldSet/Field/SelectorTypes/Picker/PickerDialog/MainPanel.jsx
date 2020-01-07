import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {withStyles, Button} from '@material-ui/core';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import {Typography} from '@jahia/design-system-kit';

import {SearchInput} from './Search/Search';

const styles = theme => ({
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '10px'
    },
    modalMain: {
        height: '100%',
        flexGrow: 1
    },
    searchInput: {
        flexGrow: 0.6
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${theme.spacing.unit * 4}`,
        backgroundColor: theme.palette.ui.epsilon
    },
    actionsJahiaAction: {
        '& svg': {
            color: theme.palette.font.gamma
        },
        '& button span[data-jahia-link]:hover': {
            textDecoration: 'underline'
        }
    }
});

const MainPanelCmp = ({
    classes,
    t,
    pickerConfig,
    editorContext,
    nodeTreeConfigs,
    initialSelectedItem,
    selectedPath,
    setSelectedPath,
    searchTerms,
    handleSearchChange,
    onItemSelection,
    onCloseDialog
}) => {
    // SelectedItem is an object when something is selected
    // undefined when never modified
    // empty array when no value is selected and something has been unselected
    const [selectedItem, setSelectedItem] = useState(undefined);
    const selectElement = () => {
        if (selectedItem) {
            onItemSelection(selectedItem);
        } else {
            onCloseDialog();
        }
    };

    const isElementSelected = !(selectedItem && selectedItem.length !== 0);
    const initialItemHasChanged = initialSelectedItem && selectedItem === undefined;

    const PickerDialogContent = pickerConfig.picker.PickerDialog.DialogContent;

    // Build table config from picker config
    const tableConfig = {
        typeFilter: pickerConfig.selectableTypesTable,
        recursionTypesFilter: ['nt:base'],
        showOnlyNodesWithTemplates: pickerConfig.showOnlyNodesWithTemplates,
        searchSelectorType: pickerConfig.searchSelectorType
    };

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
                        language={editorContext.lang}
                        onChange={handleSearchChange}
                    />
            </header>
            <main className={classes.modalMain}>
                <PickerDialogContent
                         // For all Picker
                            tableConfig={tableConfig}
                            setSelectedItem={setSelectedItem}
                            selectedPath={selectedPath}
                            setSelectedPath={setSelectedPath}
                            initialSelection={initialSelectedItem ? [initialSelectedItem] : []}
                            editorContext={editorContext}
                            searchTerms={searchTerms}

                         // For mediaPicker
                            onImageDoubleClick={onItemSelection}
                    />
            </main>

            <div className={classes.actions}>
                <Button
                    data-sel-picker-dialog-action="cancel"
                    type="button"
                    variant="secondary"
                    onClick={onCloseDialog}
                >
                    {t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                </Button>
                <div className={classes.actionsJahiaAction}>
                    <DisplayActions context={{path: selectedPath}}
                                    target="pickerDialogAction"
                                    render={({context}) => {
                                        const Button = buttonRenderer({variant: 'ghost'}, true);
                                        return <Button context={context}/>;
                                    }}
                    />
                </div>
                <Button
                    data-sel-picker-dialog-action="done"
                    disabled={!(!isElementSelected || initialItemHasChanged)}
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={selectElement}
                >
                    {t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                </Button>
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
                DialogContent: PropTypes.node.isRequired,
                dialogTitle: PropTypes.func.isRequired,
                searchPlaceholder: PropTypes.func.isRequired
            }).isRequired
        }).isRequired,
        selectableTypesTable: PropTypes.arrayOf(PropTypes.string),
        showOnlyNodesWithTemplates: PropTypes.bool,
        searchSelectorType: PropTypes.object,
        displayTree: PropTypes.bool
    }).isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    editorContext: PropTypes.object.isRequired,
    initialSelectedItem: PropTypes.string,
    selectedPath: PropTypes.string,
    setSelectedPath: PropTypes.func.isRequired,
    searchTerms: PropTypes.string,
    handleSearchChange: PropTypes.func.isRequired,
    onItemSelection: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

export const MainPanel = withStyles(styles)(MainPanelCmp);
MainPanel.displayName = 'MainPanel';
