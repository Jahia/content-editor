import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {Chip, Cloud, File, FileContent, NoCloud, Warning} from '@jahia/moonstone';

const config = {
    modified: {
        color: 'default',
        icon: <File/>,
        'data-sel-role': 'publication-info-modified-badge'
    },
    notPublished: {
        color: 'warning',
        icon: <NoCloud/>,
        'data-sel-role': 'publication-info-notPublished-badge'
    },
    published: {
        color: 'accent',
        icon: <Cloud/>,
        'data-sel-role': 'publication-info-published-badge'
    },
    warning: {
        color: 'warning',
        icon: <Warning/>,
        'data-sel-role': 'publication-info-warning-badge'
    },
    publishing: {
        color: 'default',
        icon: <FileContent/>,
        'data-sel-role': 'publication-info-polling-badge'
    }
};

const types = Object.keys(config);

export const PublicationStatus = ({type, tooltip}) => {
    const {t} = useTranslation('content-editor');
    const label = t(`label.contentEditor.publicationStatusBadge.${type}`);
    return (
        <Chip label={label} title={tooltip || label} {...config[type]}/>
    );
};

PublicationStatus.propTypes = {
    type: PropTypes.oneOf(types).isRequired,
    tooltip: PropTypes.string
};
