import React from 'react';
import {useCollaborationContext} from '~/Collab/Collaboration.context';
import Avatar from '@material-ui/core/Avatar/Avatar';

export const CollaborationProfiles = () => {
    const collaborationContext = useCollaborationContext();

    if (collaborationContext && collaborationContext.data) {
        return (
            <>
                {collaborationContext.data.subscribeToCollaboration.users.map(user => {
                    if (user.userPicture) {
                        return <Avatar key={user.userName} alt={user.userName} src={user.userPicture} imgProps={{title: user.userName}}/>;
                    }

                    return <Avatar key={user.userName} alt={user.userName} imgProps={{title: user.userName}}>{user.userName.slice(0, 1).toUpperCase()}</Avatar>;
                })}
            </>
        );
    }

    return '';
};

export default CollaborationProfiles;
