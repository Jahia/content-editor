import {InsertDriveFile} from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import React from 'react';
import {PickerEmpty} from '../../../../../../../DesignSystem/Picker';
import {PickerDialog} from '../../../../../../../DesignSystem/PickerDialog';
import {translate} from 'react-i18next';
import {ContentTable} from './ContentTable';
import pickersConfig from '../../pickersConfig';

const ContentPickerEmptyCmp = ({t, id, field, formik, editorContext}) => {
    // Resolve picker configuration
    const pickerConfig = pickersConfig.resolveConfig(field.formDefinition.selectorOptions, field.formDefinition);
    // Build tree configs
    const nodeTreeConfigs = pickerConfig.treeConfigs.map(treeConfig => {
        return {
            rootPath: treeConfig.rootPath,
            selectableTypes: treeConfig.selectableTypes,
            type: treeConfig.type,
            openableTypes: treeConfig.openableTypes,
            rootLabel: t(treeConfig.rootLabelKey, {siteName: editorContext.siteDisplayableName}),
            key: `browse-tree-${treeConfig.type}`
        };
    });

    return (
        <PickerEmpty readOnly={field.formDefinition.readOnly}
                     pickerLabel={t('content-editor:label.contentEditor.edit.fields.contentPicker.addContent')}
                     pickerIcon={<InsertDriveFile/>}
        >
            {setIsOpen => (
                <PickerDialog idInput={id}
                              site={editorContext.site}
                              lang={editorContext.lang}
                              nodeTreeConfigs={nodeTreeConfigs}
                              modalCancelLabel={t('content-editor:label.contentEditor.edit.fields.modalCancel')}
                              modalDoneLabel={t('content-editor:label.contentEditor.edit.fields.modalDone')}
                              onCloseDialog={() => setIsOpen(false)}
                              onItemSelection={content => {
                                  formik.setFieldValue(field.formDefinition.name, content[0].id, true);
                                  setIsOpen(false);
                              }}

                >{(setSelectedItem, selectedPath) => {
                    // Build table config from picker config
                   /*
                   Todo: make the picker work as CMM, use the recursionTypesFilter to browse all contents within a page
                    without displaying the content lists.
                   let isContentOrFile =
                        selectedPath === '/sites/' + editorContext.site + '/contents' ||
                        selectedPath.startsWith('/sites/' + editorContext.site + '/contents/') ||
                        selectedPath === '/sites/' + editorContext.site + '/files' ||
                        selectedPath.startsWith('/sites/' + editorContext.site + '/files/');

                    recursionTypesFilter: isContentOrFile ? ['nt:base'] : ['jnt:page', 'jnt:contentFolder']
                    */

                    const tableConfig = {
                        typeFilter: pickerConfig.selectableTypesTable,
                        recursionTypesFilter: ['nt:base']
                    };

                    return (
                        <ContentTable tableConfig={tableConfig}
                                      setSelectedItem={setSelectedItem}
                                      selectedPath={selectedPath}
                                      formik={formik}
                                      editorContext={editorContext}
                        />
                    );
                }}
                </PickerDialog>
            )}
        </PickerEmpty>
    );
};

ContentPickerEmptyCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};

export const ContentPickerEmpty = translate()(ContentPickerEmptyCmp);
