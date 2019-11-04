import React, {useContext} from 'react';

export const PublicationInfoContext = React.createContext({});

export const usePublicationInfoContext = () => useContext(PublicationInfoContext);
