import React, {useContext} from 'react';
import * as PropTypes from 'prop-types';

export const EditorIdContext = React.createContext({});

export const useEditorIdContext = () => useContext(EditorIdContext);

export const EditorIdContextProvider = ({children}) => {
    const editorIdContext = {
        editorId: '_' + Math.random().toString(36).substr(2, 9)
    };

    return (
        <EditorIdContext.Provider value={editorIdContext}>
            {children}
        </EditorIdContext.Provider>
    );
};

EditorIdContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
