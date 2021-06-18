import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components'
import { auth, db } from '../firebase';
import {Avatar} from '@material-ui/core'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import Message from './Message';
import { useState, useRef, useEffect } from 'react';
import firebase from 'firebase';
import getRecipientEmail from './getRecipientEmail';
import TimeAgo from 'timeago-react'


function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth)
    const router = useRouter();
    const [input, setInput] = useState("");

    const endOfMessageRef = useRef(null);

    const [messagesSnapshot] = useCollection(db.collection('chats')
                                                .doc(router.query.id)
                                                .collection('messages')
                                                .orderBy('timestamp','asc')
                                            );

    useEffect(() => {
        scrollToBottom();
    })

    const showMessages = () => {
        if(messagesSnapshot) {      // real time update every time 
            return messagesSnapshot.docs.map((message) => (
                <Message key={message.id} user={message.data().user} message={{ 
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime(),
                 }}
                /> 
            ))
         }
        else{           // show imeditaly stored messages used when the message is not fetched till now 
            return JSON.parse(messages).map((message) => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    const sendMessage = (e) => {
        e.preventDefault;

        db.collection("users").doc(user.uid).set(   // every time he will send msg then update timestamp to detect his last seen
            { lastSeen: firebase.firestore.FieldValue.serverTimestamp()}, 
            { merge: true }
        );

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        });

        setInput("");
        scrollToBottom();
    }

    const recipientEmail = getRecipientEmail(chat.users, user);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', recipientEmail))
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    return (
        <Container>
            <Header>
                {
                    recipient ? <Avatar src={recipient.photoURL} /> : <Avatar>{recipientEmail[0]}</Avatar>
                }
                
                <HeaderInformation>
                    <h3>{ recipientEmail }</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                            { recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : "Unavailable" }
                        </p>
                    ) : (
                        <p> Loading Last active </p>
                    )}
                   
                </HeaderInformation>

                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageConatiner>
                {showMessages()}
                {/* evry time when sender send message it already scrolled to bottom */}
                <EndOfMessage ref={endOfMessageRef} />
            </MessageConatiner>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <MicIcon />
            </InputContainer>

        </Container>
    )
}

export default ChatScreen


const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: #fff;
    z-index:100;
    top:0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;

`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: -11px;
    }
    > p {
        font-size: 14px;
        color: grey;
    }

    @media (max-width: 739px) {
        > h3 {
            margin-bottom: -7px;
            font-size: 13px
    }
    > p {
        font-size: 9px;
        color: grey;
    }
  }
`;

const HeaderIcons = styled.div`
    display: flex;
`;

const IconButton = styled.div``;

const MessageConatiner = styled.div`
    padding: 30px;
    background-color: whitesmoke;
    min-height: 90vh;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position:sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 100;
`;

const Input = styled.input`
        flex: 1;
        align-items: center;
        padding: 10px;
        position: sticky;
        bottom: 0;
        background-color: whitesmoke;
        z-index: 100;
        outline-width: 0;
        border:none; 
        border-radius: 8px;
        margin-left: 4px;
        margin-right: 4px;
`;

const EndOfMessage = styled.div`
    height: 25px;
`;