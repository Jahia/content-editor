import React from 'react';
import PropTypes from 'prop-types';
import {Create} from './Create';
import {CreateFormQuery} from './create.gql-queries';
import {adaptCreateFormData} from './adaptCreateFormData';
import {Edit} from './Edit';
import {EditFormQuery} from './edit.gql-queries';
import {adaptEditFormData} from './adaptEditFormData';
import {ContentEditorConfigContextProvider, ContentEditorContextProvider} from '~/contexts';
import {Constants} from '~/ContentEditor.constants';
import {useFormDefinition} from '~/contexts/ContentEditor/useFormDefinitions';

const useEditFormDefinition = () => useFormDefinition(EditFormQuery, adaptEditFormData);
const useCreateFormDefinition = () => useFormDefinition(CreateFormQuery, adaptCreateFormData);

export const ContentEditor = props => {
    const {mode, envProps} = props;

    return (
        <ContentEditorConfigContextProvider config={props}>
            {mode === 'edit' && (
                <ContentEditorContextProvider useFormDefinition={envProps.useFormDefinition || useEditFormDefinition}>
                    <Edit/>
                </ContentEditorContextProvider>
            )}
            {mode === 'create' && (
                <ContentEditorContextProvider useFormDefinition={envProps.useFormDefinition || useCreateFormDefinition}>
                    <Create/>
                </ContentEditorContextProvider>
            )}
        </ContentEditorConfigContextProvider>
    );
};

ContentEditor.propTypes = {
    mode: PropTypes.oneOf([Constants.routes.baseCreateRoute, Constants.routes.baseEditRoute]).isRequired,
    envProps: PropTypes.object.isRequired
};
