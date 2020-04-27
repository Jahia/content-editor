import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Menu, MenuItem, withStyles} from '@material-ui/core';
import {Button, Typography} from '@jahia/design-system-kit';
import {ChevronDown} from 'mdi-material-ui';

const styles = theme => ({
    siteSwitcher: {
        margin: theme.spacing.unit * 2
    },
    menuDialog: {
        zIndex: 10012 // IMPORTANT: DO NOT REMOVE: CKEditor image picker is using 10010, CE picker is using 10011, and we need to be on top of this interfaces
    }
});

const SiteSwitcherCmp = ({id, siteKey, siteNodes, onSelectSite, classes}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const siteNode = siteNodes.find(siteNode => siteNode.name === siteKey);

    return (
        <>
            <Button aria-owns={anchorEl ? id : null}
                    size="compact"
                    color="inverted"
                    aria-haspopup="true"
                    data-cm-role={id}
                    className={classes.siteSwitcher}
                    onClick={handleClick}
            >
                <Typography noWrap variant="zeta" color="inherit">
                    {siteNode.displayName}
                </Typography>
                &nbsp;
                <ChevronDown fontSize="small" color="inherit"/>
            </Button>
            <Menu id={id} anchorEl={anchorEl} open={Boolean(anchorEl)} ModalClasses={{root: classes.menuDialog}} onClose={handleClose}>
                {siteNodes.map(siteNode => {
                    return (
                        <MenuItem
                            key={siteNode.uuid}
                            onClick={() => {
                                onSelectSite(siteNode);
                                handleClose();
                            }}
                        >
                            {siteNode.displayName}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

SiteSwitcherCmp.propTypes = {
    id: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    onSelectSite: PropTypes.func.isRequired,
    siteKey: PropTypes.string.isRequired,
    siteNodes: PropTypes.arrayOf(PropTypes.object).isRequired
};

const SiteSwitcher = withStyles(styles)(SiteSwitcherCmp);
SiteSwitcher.displayName = 'SiteSwitcher';
export default SiteSwitcher;
