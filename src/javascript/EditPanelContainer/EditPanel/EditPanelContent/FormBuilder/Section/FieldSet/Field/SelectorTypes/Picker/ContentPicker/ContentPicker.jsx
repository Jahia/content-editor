import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';
import {ContentPickerEmpty} from './ContentPickerEmpty/ContentPickerEmpty';
import {ContentPickerFilled} from './ContentPickerFilled/ContentPickerFilled';
import pickerConfigs from '../Picker.configs';
import {translate} from 'react-i18next';
import {FieldPropTypes} from '../../../../../../../../../FormDefinitions/FormData.proptypes';

const ContentPickerCmp = ({field, value, id, editorContext, formik, t, setActionContext}) => {
    // Resolve picker configuration
    const pickerConfig = pickerConfigs.resolveConfig(
        field.selectorOptions,
        field
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

    if (value) {
        return (
            <ContentPickerFilled
                id={id}
                uuid={value}
                field={field}
                formik={formik}
                editorContext={editorContext}
                pickerConfig={pickerConfig}
                nodeTreeConfigs={nodeTreeConfigs}
                setActionContext={setActionContext}
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
            setActionContext={setActionContext}
        />
    );
};

ContentPickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: FieldPropTypes.string,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const ContentPicker = translate()(connect(ContentPickerCmp));
