import React, {useContext} from 'react';

export const ContentEditorContext = React.createContext('content-editor-context');

export const useContentEditorContext = () => useContext(ContentEditorContext);
