import React, {useState} from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {Picker} from '~design-system/Picker';
import {ContentPickerFilledQuery} from './ContentPickerFilled.gql-queries';
import {encodeJCRPath} from '../../../../../../../../../EditPanel.utils';
import {useQuery} from 'react-apollo-hooks';
import {ContentPickerDialog} from '../ContentPickerDialog';
import {FieldPropTypes} from '../../../../../../../../../../FormDefinitions/FormData.proptypes';

const ContentPickerFilledCmp = ({t, field, formik, id, uuid, editorContext, nodeTreeConfigs, pickerConfig, setActionContext}) => {
    const [isOpen, setIsOpen] = useState(false);

    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            uuid: uuid,
            language: editorContext.lang
        }
    });

    if (error) {
        const message = t(
            'content-media-manager:label.contentManager.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const contentData = data.jcr.result;
    const fieldData = {
        path: contentData.path,
        url: encodeJCRPath(`${contentData.primaryNodeType.icon}.png`),
        name: contentData.displayName,
        info: contentData.primaryNodeType.displayName
    };

    setActionContext(prevActionContext => ({
        open: setIsOpen,
        fieldData,
        editorContext,
        contextHasChange: !prevActionContext.fieldData || prevActionContext.fieldData.path !== fieldData.path
    }));

    return (
        <>
            <Picker readOnly={field.readOnly}
                    fieldData={fieldData}
                    onClick={() => setIsOpen(!isOpen)}
            />

            <ContentPickerDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                editorContext={editorContext}
                initialSelectedItem={contentData.path}
                id={id}
                nodeTreeConfigs={nodeTreeConfigs}
                t={t}
                formik={formik}
                field={field}
                pickerConfig={pickerConfig}
            />
        </>
    );
};

ContentPickerFilledCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: FieldPropTypes.isRequired,
    uuid: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    editorContext: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    nodeTreeConfigs: PropTypes.array.isRequired,
    pickerConfig: PropTypes.object.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export const ContentPickerFilled = translate()(ContentPickerFilledCmp);
