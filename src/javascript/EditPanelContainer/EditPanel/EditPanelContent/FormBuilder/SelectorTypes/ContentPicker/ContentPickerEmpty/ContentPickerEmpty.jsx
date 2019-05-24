import {InsertDriveFile} from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import React from 'react';
import {PickerEmpty} from '../../../../../../../DesignSystem/Picker';
import {PickerDialog} from '../../../../../../../DesignSystem/PickerDialog';
import {translate} from 'react-i18next';
import {ContentTable} from './ContentTable';

const ContentPickerEmptyCmp = ({t, id, field, formik, editorContext}) => {
    return (
        <PickerEmpty readOnly={field.formDefinition.readOnly}
                     pickerLabel={t('content-editor:label.contentEditor.edit.fields.contentPicker.addContent')}
                     pickerIcon={<InsertDriveFile/>}
        >
            {setIsOpen => (
                <PickerDialog idInput={id}
                              site={editorContext.site}
                              lang={editorContext.lang}
                              nodeTreeConfigs={[{
                                  rootPath: '/contents',
                                  selectableTypes: ['jnt:contentFolder'],
                                  type: 'contents',
                                  openableTypes: ['jnt:contentFolder'],
                                  rootLabel: t('content-editor:label.contentEditor.edit.fields.contentPicker.contentsRootLabel'),
                                  key: 'browse-tree-contents'
                              },
                                  {
                                      rootPath: '',
                                      selectableTypes: ['jnt:page', 'jnt:virtualsite'],
                                      type: 'pages',
                                      openableTypes: ['jnt:page', 'jnt:virtualsite', 'jnt:navMenuText'],
                                      rootLabel: t('content-editor:label.contentEditor.edit.fields.contentPicker.pagesRootLabel'),
                                      key: 'browse-tree-pages'
                                  }]}
                              modalCancelLabel={t('content-editor:label.contentEditor.edit.fields.modalCancel')}
                              modalDoneLabel={t('content-editor:label.contentEditor.edit.fields.modalDone')}
                              onCloseDialog={() => setIsOpen(false)}
                              onItemSelection={content => {
                                  formik.setFieldValue(field.formDefinition.name, content[0].id, true);
                                  setIsOpen(false);
                              }}

                >
                    {(setSelectedItem, selectedPath) => (
                        <ContentTable field={field}
                                      setSelectedItem={setSelectedItem}
                                      selectedPath={selectedPath}
                                      formik={formik}
                                      editorContext={editorContext}
                        />
                    )}
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
