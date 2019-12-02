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

const styles = theme => ({
    rootDialog: {
        margin: theme.spacing.unit * 8
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
    const [site, setSite] = useState(editorContext.site);

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

    const siteNodes = data => {
        const siteNodes = [];

        if (data && data.jcr.result) {
            for (const siteNode of data.jcr.result.siteNodes) {
                if (siteNode.hasPermission) {
                    siteNodes.push(siteNode);
                }
            }
        }

        return siteNodes.sort((elem1, elem2) => {
            if (elem1.displayName < elem2.displayName) {
                return -1;
            }

            if (elem1.displayName > elem2.displayName) {
                return 1;
            }

            return 0;
        });
    };

    return (
        <Dialog
            fullScreen
            classes={{root: classes.rootDialog}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={() => setIsOpen(false)}
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
                                   siteNodes={siteNodes(data)}
                                   lang={editorContext.lang}
                                   initialSelectedItem={initialSelectedItem}
                                   nodeTreeConfigs={[
                                       {
                                           rootPath: `/sites/${site}/files`,
                                           selectableTypes: ['jnt:folder'],
                                           type: 'files',
                                           openableTypes: ['jnt:folder'],
                                           rootLabel: t(
                                               'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel'
                                           ),
                                           key: 'browse-tree-files'
                                       }
                                   ]}
                                   modalCancelLabel={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                                   modalDoneLabel={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                                   onCloseDialog={() => setIsOpen(false)}
                                   onItemSelection={onItemSelection}
                                   onSelectSite={siteNode => onSelectSite(siteNode)}
                               >
                                   {(setSelectedItem, selectedPath, initialSelection) => (
                                       <ImageListQuery
                                           setSelectedItem={setSelectedItem}
                                           selectedPath={selectedPath}
                                           initialSelection={initialSelection}
                                           onImageDoubleClick={onItemSelection}
                                       />
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
