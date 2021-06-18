import {Avatar} from '@material-ui/core'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components'
import { auth, db } from '../firebase';
import getRecipientEmail from './getRecipientEmail'
import { useRouter } from 'next/router'


function Chat({ id,users }) {  // this users is from firebase which carrys array of 2 [ourEmail, email with whom they chat]
    const router = useRouter();
    const [logedInUser] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(users, logedInUser)//  email with whom they chat

    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(users, logedInUser)))  // checking in our data base of firebase ki kya recieptEmail valla banda hmare db me register hai  
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    
    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    const screenWidth = window.innerWidth;
    const forMobile = screenWidth<739 ? true : false ;

    const enterChat = () => {
        // router.push(`/chat/${id}`)
        forMobile ? router.push(`/chat/mobile/${id}`) : router.push(`/chat/${id}`)
    }
    
    return (
        <Container onClick={ enterChat }>
            {recipient ? (
                <UserAvatar src={recipient?.photoURL} />
            ): <UserAvatar>{ recipientEmail[0] }</UserAvatar>}
            <p>{ recipientEmail }</p>
        </Container>
    )
}

export default Chat

const Container = styled.div`
    display:flex;
    align-items: center;
    cursor: pointer;
    padding:15px;
    word-break: break-word;

    :hover {
        background-color: #e9eaeb;
    }

`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;