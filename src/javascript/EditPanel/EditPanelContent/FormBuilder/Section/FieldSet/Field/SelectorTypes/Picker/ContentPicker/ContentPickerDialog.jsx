import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog/Dialog';
import {ContentTable} from './ContentTable';
import {PickerDialog} from '~/DesignSystem/PickerDialog';

import Slide from '@material-ui/core/Slide';
import {FastField} from 'formik';
import {withStyles} from '@material-ui/core';
import {useQuery} from 'react-apollo-hooks';
import {SiteNodesQuery} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/Picker/PickerDialog.gql-queries';
import {ProgressOverlay} from '@jahia/react-material';
import {getSiteNodes} from '../Picker.utils';

const styles = theme => ({
    rootDialog: {
        margin: theme.spacing.unit * 8
    }
});

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const ContentPickerDialog = ({
    classes,
    isOpen,
    setIsOpen,
    initialSelectedItem,
    editorContext,
    id,
    field,
    nodeTreeConfigs,
    t,
    pickerConfig
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

    const siteNodes = getSiteNodes(data, t('content-editor:label.contentEditor.siteSwitcher.allSites'));

    const siteNode = siteNodes.find(siteNode => siteNode.name === site);

    const showSiteSwitcher = !(field.selectorOptions && field.selectorOptions.find(option => option.value === 'site'));

    return (
        <Dialog
            fullScreen
            classes={{root: classes.rootDialog}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={() => setIsOpen(false)}
        >
            <FastField shouldUpdate={() => true}
                       render={({form: {setFieldValue, setFieldTouched}}) => (
                           <PickerDialog
                               displayTree={pickerConfig.displayTree}
                               idInput={id}
                               site={site}
                               siteNodes={siteNodes}
                               showSiteSwitcher={showSiteSwitcher}
                               lang={editorContext.lang}
                               initialSelectedItem={initialSelectedItem}
                               nodeTreeConfigs={nodeTreeConfigs.map(nodeTreeConfig => ({
                                   ...nodeTreeConfig,
                                   openableTypes: siteNode.allSites ? [...nodeTreeConfig.treeConfig.openableTypes, 'jnt:virtualsitesFolder', 'jnt:virtualsite'] : nodeTreeConfig.treeConfig.openableTypes,
                                   rootPath: siteNode.allSites ? '/sites' : nodeTreeConfig.treeConfig.rootPath(site),
                                   rootLabel: siteNode.displayName
                               }))}
                               modalCancelLabel={t('content-editor:label.contentEditor.edit.fields.modalCancel').toUpperCase()}
                               modalDoneLabel={t('content-editor:label.contentEditor.edit.fields.modalDone').toUpperCase()}
                               onSelectSite={siteNode => onSelectSite(siteNode)}
                               onCloseDialog={() => setIsOpen(false)}
                               onItemSelection={content => {
                                   setFieldValue(
                                       id,
                                       content[0] ? content[0].id : null,
                                       true
                                   );
                                   setIsOpen(false);
                                   setFieldTouched(field.name, field.multiple ? [true] : true);
                               }}
                           >
                               {(setSelectedItem, selectedPath, initialSelection) => {
                                   // Build table config from picker config
                                   const tableConfig = {
                                       typeFilter: pickerConfig.selectableTypesTable,
                                       recursionTypesFilter: ['nt:base'],
                                       showOnlyNodesWithTemplates: pickerConfig.showOnlyNodesWithTemplates
                                   };

                                   return (
                                       <ContentTable
                                           tableConfig={tableConfig}
                                           setSelectedItem={setSelectedItem}
                                           selectedPath={selectedPath}
                                           initialSelection={initialSelection}
                                           editorContext={editorContext}
                                       />
                                   );
                               }}
                           </PickerDialog>
                       )}
            />
        </Dialog>
    );
};

ContentPickerDialog.defaultProps = {
    initialSelectedItem: null
};

ContentPickerDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    editorContext: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    initialSelectedItem: PropTypes.string
};

export default withStyles(styles)(ContentPickerDialog);
