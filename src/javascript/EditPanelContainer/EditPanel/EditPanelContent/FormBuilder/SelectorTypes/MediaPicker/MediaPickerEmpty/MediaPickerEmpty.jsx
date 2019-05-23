import ImageIcon from '@material-ui/icons/Image';
import * as PropTypes from 'prop-types';
import React from 'react';
import {PickerEmpty} from '../../../../../../../DesignSystem/Picker';
import {PickerDialog} from '../../../../../../../DesignSystem/PickerDialog';
import {ImageListQuery} from './ImageListQuery';
import {translate} from 'react-i18next';

const MediaPickerEmptyCmp = ({t, id, field, formik, editorContext}) => {
    return (
        <PickerEmpty readOnly={field.formDefinition.readOnly}
                     pickerLabel={t('content-editor:label.contentEditor.edit.fields.imagePicker.addImage')}
                     pickerIcon={<ImageIcon/>}
        >
            {setIsOpen => (
                <PickerDialog idInput={id}
                              site={editorContext.site}
                              lang={editorContext.lang}
                              nodeTreeConfigs={[{
                                  rootPath: '/files',
                                  selectableTypes: ['jnt:folder'],
                                  type: 'files',
                                  openableTypes: ['jnt:folder'],
                                  rootLabel: t('content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel'),
                                  key: 'browse-tree-files'
                              }]}
                              modalCancelLabel={t('content-editor:label.contentEditor.edit.fields.modalCancel')}
                              modalDoneLabel={t('content-editor:label.contentEditor.edit.fields.modalDone')}
                              onCloseDialog={() => setIsOpen(false)}
                              onItemSelection={image => {
                                  formik.setFieldValue(field.formDefinition.name, image[0].uuid, true);
                                  setIsOpen(false);
                              }}

                >
                    {(setSelectedItem, selectedPath) => (
                        <ImageListQuery field={field}
                                        setSelectedItem={setSelectedItem}
                                        selectedPath={selectedPath}
                                        formik={formik}
                        />
                    )}
                </PickerDialog>
            )}
        </PickerEmpty>
    );
};

MediaPickerEmptyCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};

export const MediaPickerEmpty = translate()(MediaPickerEmptyCmp);
