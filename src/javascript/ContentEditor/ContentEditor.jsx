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
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

export const ContentEditor = props => {
    const {mode, envProps} = props;

    return (
        <ContentEditorConfigContextProvider config={props}>
            <DndProvider backend={Backend}>
                { mode === 'edit' && (
                    <ContentEditorContextProvider formQuery={EditFormQuery} formDataAdapter={adaptEditFormData}>
                        <Edit/>
                    </ContentEditorContextProvider>
                )}
                { mode === 'create' && (
                    <ContentEditorContextProvider formQuery={CreateFormQuery} formDataAdapter={adaptCreateFormData}>
                        <Create/>
                    </ContentEditorContextProvider>
                )}
            </DndProvider>
        </ContentEditorConfigContextProvider>
    );
};

ContentEditor.propTypes = {
    mode: PropTypes.oneOf([Constants.routes.baseCreateRoute, Constants.routes.baseEditRoute]).isRequired,
    envProps: PropTypes.object.isRequired
};
