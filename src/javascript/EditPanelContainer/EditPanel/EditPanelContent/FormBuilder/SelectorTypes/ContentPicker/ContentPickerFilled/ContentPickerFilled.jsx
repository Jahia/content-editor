import React from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import * as PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {PickerFilled} from '../../../../../../../DesignSystem/Picker';
import {ContentPickerFilledQuery} from './ContentPickerFilled.gql-queries';
import {encodeJCRPath} from '../../../../../EditPanel.utils';
import {useQuery} from 'react-apollo-hooks';

const ContentPickerFilledCmp = ({t, field, id, uuid, editorContext}) => {
    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            uuid: uuid,
            language: editorContext.lang
        }
    });

    if (error) {
        const message = t('content-media-manager:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')});
        return (<>{message}</>);
    }

    if (loading) {
        return (<ProgressOverlay/>);
    }

    const contentData = data.jcr.result;
    const fieldData = {
        url: encodeJCRPath(`${contentData.primaryNodeType.icon}.png`),
        name: contentData.displayName,
        info: contentData.primaryNodeType.displayName
    };

    return (
        <PickerFilled readOnly={field.formDefinition && field.formDefinition.readOnly}
                      field={field}
                      fieldData={fieldData}
                      selectedId={uuid}
                      id={id}
        />
    );
};

ContentPickerFilledCmp.propTypes = {
    t: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    editorContext: PropTypes.object.isRequired
};

export const ContentPickerFilled = translate()(ContentPickerFilledCmp);
