import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@jahia/design-system-kit';
import {Folder} from '@material-ui/icons';
import {withStyles} from '@material-ui/core';
import {useQuery} from 'react-apollo-hooks';
import {FolderNameQuery} from './FolderName.gql-queries';

const styles = theme => ({
    folderPartContainer: {
        width: '200px',
        margin: '5px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderLeft: `1px solid ${theme.palette.ui.zeta}`
    },
    folderName: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        flexGrow: 1
    },
    icon: {
        margin: '0 5px 0 15px'
    }
});

const FolderDisplayerCmp = ({classes, selectedPath}) => {
    const {data, error, loading} = useQuery(FolderNameQuery, {
        variables: {
            typeFilter: ['jmix:image'],
            path: selectedPath
        }
    });

    if (error) {
        console.error(error);
    }

    if (error || loading) {
        return <></>;
    }

    return (
        <div className={classes.folderPartContainer}>
            <Folder className={classes.icon}/>
            <Typography
                component="span"
                variant="zeta"
                color="beta"
                className={classes.folderName}
            >
                {data.jcr.result.displayName}
            </Typography>
        </div>
    );
};

FolderDisplayerCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedPath: PropTypes.string.isRequired
};
export const FolderDisplayer = withStyles(styles)(FolderDisplayerCmp);
