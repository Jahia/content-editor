import React, {useContext} from 'react';
import PropTypes from 'prop-types';

export const FieldContext = React.createContext({});
export const useFieldContext = () => useContext(FieldContext);

export const FieldContextProvider = ({field, children}) => {
    // Expose only subset of field attributes
    const {multiple} = field;
    const fieldContext = {
        multiple
    };

    return (
        <FieldContext.Provider value={fieldContext}>
            {children}
        </FieldContext.Provider>
    );
};

FieldContextProvider.propTypes = {
    field: PropTypes.shape({
        multiple: PropTypes.bool
    }),
    children: PropTypes.node.isRequired
};
