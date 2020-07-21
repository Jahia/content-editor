import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {BreadcrumbItem, Menu, MenuItem, MoreHoriz} from '@jahia/moonstone';

const CompositePathEntry = ({items, onItemClick}) => {
    const [isMenuDisplayed, setMenuDisplayed] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuContainerEl = useRef(null);

    const handleButtonClick = () => {
        setAnchorEl(menuContainerEl);
        setMenuDisplayed(!isMenuDisplayed);
    };

    const handleMenuClose = () => {
        setMenuDisplayed(false);
    };

    return (items.length > 0) &&
        <div ref={menuContainerEl} data-sel-role="breadcrumb-item">
            <BreadcrumbItem icon={<MoreHoriz/>} onClick={handleButtonClick}/>
            <Menu isDisplayed={isMenuDisplayed}
                  data-sel-role="breadcrumb-menu"
                  anchorEl={anchorEl}
                  transformElOrigin={{vertical: 'top', horizontal: 'left'}}
                  onClose={handleMenuClose}
            >
                {items.map(item => <MenuItem key={item.uuid} label={item.displayName || item.uuid} data-sel-role="breadcrumb-menu-item" onClick={() => onItemClick(item.path)}/>)}
            </Menu>
        </div>;
};

CompositePathEntry.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onItemClick: PropTypes.func
};

CompositePathEntry.defaultProps = {
    onItemClick: () => {}
};

export default CompositePathEntry;
