import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';
import {ContentPickerEmpty} from './ContentPickerEmpty/ContentPickerEmpty';
import {ContentPickerFilled} from './ContentPickerFilled/ContentPickerFilled';
import pickersConfig from '../pickersConfig';
import {translate} from 'react-i18next';

const ContentPickerCmp = ({field, id, editorContext, formik, t}) => {
    const uuid = formik.values[field.formDefinition.name];

    // Resolve picker configuration
    const pickerConfig = pickersConfig.resolveConfig(
        field.formDefinition.selectorOptions,
        field.formDefinition
    );
    // Build tree configs
    const nodeTreeConfigs = pickerConfig.treeConfigs.map(treeConfig => {
        return {
            rootPath: treeConfig.rootPath,
            selectableTypes: treeConfig.selectableTypes,
            type: treeConfig.type,
            openableTypes: treeConfig.openableTypes,
            rootLabel: t(treeConfig.rootLabelKey, {
                siteName: editorContext.siteDisplayableName
            }),
            key: `browse-tree-${treeConfig.type}`
        };
    });

    if (uuid) {
        return (
            <ContentPickerFilled
                id={id}
                uuid={uuid}
                field={field}
                formik={formik}
                editorContext={editorContext}
                pickerConfig={pickerConfig}
                nodeTreeConfigs={nodeTreeConfigs}
            />
        );
    }

    return (
        <ContentPickerEmpty
            id={id}
            field={field}
            formik={formik}
            editorContext={editorContext}
            pickerConfig={pickerConfig}
            nodeTreeConfigs={nodeTreeConfigs}
        />
    );
};

ContentPickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
};

export const ContentPicker = translate()(connect(ContentPickerCmp));
