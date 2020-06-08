import React, {useState} from 'react';
import {useCollaborationContext} from '~/Collab/Collaboration.context';
import Badge from '@material-ui/core/Badge/Badge';
import MessageIcon from '@material-ui/icons/Message';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {ChatFeed, Message} from 'react-chat-ui';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import Paper from '@material-ui/core/Paper/Paper';
import InputBase from '@material-ui/core/InputBase/InputBase';
import {useApolloClient} from '@apollo/react-hooks';
import {PostMessage} from '~/Collab/collab.gql-mutations';

const styles = () => ({
    chatBox: {
        width: '370px',
        height: 'calc(100% - 120px)',
        maxHeight: '590px',
        position: 'fixed',
        right: '25px',
        bottom: '25px',
        '-webkit-box-sizing': 'border-box',
        boxsizing: 'border-box',
        '-webkit-box-shadow': '0 7px 40px 2px hsla(210,1%,58%,.3)',
        boxshadow: '0 7px 40px 2px hsla(210,1%,58%,.3)',
        background: '#fff',
        display: 'flex',
        '-webkit-box-orient': 'vertical',
        '-webkit-box-direction': 'normal',
        flexDirection: 'column',
        '-webkit-box-pack': 'justify',
        justifyContent: 'space-between',
        transition: '.3s ease-in-out',
        borderRadius: '10px'
    },
    chatHeader: {
        background: '#4e8cff',
        minHeight: '75px',
        borderTopLeftRadius: '9px',
        borderTopRightRadius: '9px',
        color: '#fff',
        padding: '10px',
        boxShadow: '0 1px 4px rgba(0,0,0,.2)',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex'
    },
    chatTitle: {
        flex: '1',
        userSelect: 'none',
        alignSelf: 'center',
        padding: '10px'
    },
    chatClose: {
        alignSelf: 'center',
        marginRight: '10px'
    },
    chatMessages: {
        overflowY: 'auto',
        padding: '40px 20px'
    },
    chatActions: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center'
    },
    chatInput: {
        marginLeft: 8,
        flex: 1
    },
    chatButton: {
        padding: 10
    }
});

export const CollaborationChatCmp = ({classes, path}) => {
    const collaborationContext = useCollaborationContext();
    const client = useApolloClient();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);

    let messages;
    if (collaborationContext && collaborationContext.data) {
        messages = collaborationContext.data.subscribeToCollaboration.messages.map(message => {
            return new Message({
                senderName: message.author,
                message: message.message,
                id: message.author === collaborationContext.data.subscribeToCollaboration.currentUser.userName ? 0 : message.author
            });
        });
    } else {
        return <></>;
    }

    const postMessage = () => {
        if (message) {
            client
                .mutate({
                    mutation: PostMessage,
                    variables: {
                        nodePath: path,
                        message: message
                    }
                })
                .then(() => {
                    setMessage('');
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <>
            {open &&
            <div className={classes.chatBox}>
                <div className={classes.chatHeader}>
                    <div className={classes.chatTitle}>Chat</div>
                    <IconButton className={classes.chatClose}
                                onClick={() => {
                                    setOpen(false);
                                }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </div>
                <div className={classes.chatMessages}>
                    <ChatFeed
                        showSenderName
                        messages={messages}
                        hasInputField={false}
                        bubblesCentered={false}
                        bubbleStyles={
                            {
                                text: {
                                    fontSize: 16
                                },
                                chatbubble: {
                                    borderRadius: 20,
                                    padding: 14
                                }
                            }
                        }
                    />
                </div>
                <Paper className={classes.chatActions} elevation={1}>
                    <InputBase
                        className={classes.chatInput}
                        placeholder="Type your message"
                        value={message}
                        onChange={event => {
                            setMessage(event.target.value);
                        }}
                    />
                    <IconButton color="primary"
                                className={classes.chatButton}
                                onClick={() => {
                                    postMessage();
                                }}
                    >
                        <SendIcon/>
                    </IconButton>
                </Paper>
            </div>}

            <IconButton onClick={() => {
                setOpen(true);
            }}
            >
                <Badge badgeContent={messages.length} color="primary">
                    <MessageIcon/>
                </Badge>
            </IconButton>
        </>
    );
};

CollaborationChatCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired
};

export const CollaborationChat = withStyles(styles)(CollaborationChatCmp);
CollaborationChat.displayName = 'CollaborationChat';
