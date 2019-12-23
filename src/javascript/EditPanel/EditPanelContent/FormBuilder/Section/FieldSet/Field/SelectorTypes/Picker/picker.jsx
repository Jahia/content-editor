import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'formik';
import pickerConfigs from './Picker.configs';
import {translate} from 'react-i18next';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';

const PickerCmp = ({field, value, id, editorContext, formik, t, setActionContext}) => {
    // Resolve picker configuration
    const pickerConfig = pickerConfigs.resolveConfig(
        field.selectorOptions,
        field
    );

    // Build tree configs
    const nodeTreeConfigs = pickerConfig.treeConfigs.map(treeConfig => {
        return {
            treeConfig,
            rootPath: treeConfig.rootPath(editorContext.site),
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
        const PickerFilled = pickerConfig.picker.filled;

        return (
            <PickerFilled
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

    const PickerEmpty = pickerConfig.picker.empty;

    return (
        <PickerEmpty
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

PickerCmp.propTypes = {
    editorContext: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const Picker = translate()(connect(PickerCmp));
