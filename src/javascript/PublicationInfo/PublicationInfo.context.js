import React, {useContext} from 'react';
import {usePublicationInfo} from './usePublicationInfo';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

export const PublicationInfoContext = React.createContext({});

export const usePublicationInfoContext = () => useContext(PublicationInfoContext);

export const PublicationInfoContextProvider = ({uuid, lang, children}) => {
    const {t} = useTranslation('content-editor');
    const {
        publicationInfoError, publicationInfoErrorMessage, ...publicationInfoContext
    } = usePublicationInfo({
        uuid: uuid,
        language: lang
    }, t);

    if (publicationInfoError) {
        console.error(publicationInfoError);
        return <>{publicationInfoErrorMessage}</>;
    }

    return (
        <PublicationInfoContext.Provider value={publicationInfoContext}>
            {children}
        </PublicationInfoContext.Provider>
    );
};

PublicationInfoContextProvider.propTypes = {
    uuid: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
