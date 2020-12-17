import PropTypes from 'prop-types';
import React from 'react';
import {Dropdown} from '@jahia/moonstone';
import style from './SiteSwitcher.scss';

const SiteSwitcher = ({id, siteKey, siteNodes, onSelectSite}) => {
    return (
        <Dropdown
            id={id}
            size="medium"
            value={siteKey}
            className={style.dropdown}
            label={siteNodes.find(siteNode => siteNode.name === siteKey)?.displayName}
            data={siteNodes.map(siteNode => ({label: siteNode.displayName, value: siteNode.name}))}
            onChange={onSelectSite}
        />
    );
};

SiteSwitcher.propTypes = {
    id: PropTypes.string.isRequired,
    onSelectSite: PropTypes.func.isRequired,
    siteKey: PropTypes.string.isRequired,
    siteNodes: PropTypes.arrayOf(PropTypes.object).isRequired
};
export default SiteSwitcher;
