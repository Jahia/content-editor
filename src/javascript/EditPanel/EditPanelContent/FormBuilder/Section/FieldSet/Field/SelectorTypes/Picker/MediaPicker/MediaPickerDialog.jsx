import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ImageListQuery} from './ImageListQuery';
import {PickerDialog} from '~/DesignSystem/PickerDialog';

import Slide from '@material-ui/core/Slide';
import {FastField} from 'formik';
import {withStyles} from '@material-ui/core';
import {useQuery} from 'react-apollo-hooks';
import {SiteNodesQuery} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/Picker/PickerDialog.gql-queries';
import {ProgressOverlay} from '@jahia/react-material';
import {getSiteNodes} from '../Picker.utils';
import {Typography} from '@jahia/design-system-kit';
import {SearchInput} from '../Search/Search';
import {getSite} from '~/DesignSystem/PickerDialog/PickerDialog.utils';

const styles = theme => ({
    rootDialog: {
        margin: theme.spacing.unit * 8
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '10px'
    },
    searchInput: {
        flexGrow: 0.6
    }
});

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const MediaPickerDialog = ({
    classes,
    isOpen,
    setIsOpen,
    editorContext,
    id,
    field,
    t,
    initialSelectedItem
}) => {
    const selectedSite = initialSelectedItem ? getSite(initialSelectedItem).slice(7) : editorContext.site;
    const [site, setSite] = useState(selectedSite);

    const {data, error, loading} = useQuery(SiteNodesQuery, {
        variables: {
            query: 'select * from [jnt:virtualsite] where ischildnode(\'/sites\')',
            displayLanguage: editorContext.lang
        }
    });

    if (error) {
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const onSelectSite = siteNode => {
        setSite(siteNode.name);
    };

    const siteNodes = getSiteNodes(data, t('content-editor:label.contentEditor.siteSwitcher.allSites'));

    const nodeTreeConfig = {
        rootPath: `/sites/${site}/files`,
        selectableTypes: ['jnt:folder'],
        type: 'files',
        openableTypes: ['jnt:folder'],
        rootLabel: t(
            'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel'
        ),
        key: 'browse-tree-files'
    };
    const siteNode = siteNodes.find(siteNode => siteNode.name === site);
    if (siteNode.allSites) {
        nodeTreeConfig.rootPath = '/sites';
        nodeTreeConfig.selectableTypes = ['jnt:virtualsitesFolder', 'jnt:folder'];
        nodeTreeConfig.openableTypes = ['jnt:virtualsitesFolder', 'jnt:virtualsite', 'jnt:folder'];
        nodeTreeConfig.rootLabel = siteNode.displayName;
    }

    const showSiteSwitcher = !(field.selectorOptions && field.selectorOptions.find(option => option.value === 'site'));

    return (
        <Dialog
            fullScreen
            classes={{root: classes.rootDialog}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={() => {
                setIsOpen(false);
                setSite(selectedSite);
            }}
        >
            <FastField shouldUpdate={() => true}
                       render={({form}) => {
                           const onItemSelection = image => {
                               form.setFieldValue(
                                   id,
                                   image ? image.uuid : null,
                                   true
                               );
                               setIsOpen(false);
                               form.setFieldTouched(field.name, field.multiple ? [true] : true);
                           };

                           return (
                               <PickerDialog
                                   idInput={id}
                                   site={site}
                                   siteNodes={siteNodes}
                                   showSiteSwitcher={showSiteSwitcher}
                                   lang={editorContext.lang}
                                   initialSelectedItem={initialSelectedItem}
                                   nodeTreeConfigs={[nodeTreeConfig]}
                                   modalCancelLabel={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                                   modalDoneLabel={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                                   onCloseDialog={() => setIsOpen(false)}
                                   onItemSelection={onItemSelection}
                                   onSelectSite={siteNode => onSelectSite(siteNode)}
                               >
                                   {(setSelectedItem, selectedPath, initialSelection) => (
                                       <>
                                           <header className={classes.modalHeader}>
                                               <Typography variant="delta" color="alpha">
                                                   {t('content-editor:label.contentEditor.edit.fields.imagePicker.modalTitle')}
                                               </Typography>
                                               <SearchInput
                                                    selectedPath={selectedPath}
                                                    placeholder={t('content-editor:label.contentEditor.edit.fields.imagePicker.searchPlaceholder')}
                                                    className={classes.searchInput}
                                                />
                                           </header>
                                           <main>
                                               <ImageListQuery
                                                   setSelectedItem={setSelectedItem}
                                                   selectedPath={selectedPath}
                                                   initialSelection={initialSelection}
                                                   onImageDoubleClick={onItemSelection}
                                               />
                                           </main>
                                       </>
                                       )}
                               </PickerDialog>
                           );
                       }}
            />
        </Dialog>
    );
};

MediaPickerDialog.defaultProps = {
    initialSelectedItem: null
};

MediaPickerDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    initialSelectedItem: PropTypes.string
};

export default withStyles(styles)(MediaPickerDialog);
