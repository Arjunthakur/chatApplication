import Head from 'next/head'
import styled from 'styled-components'
import ChatScreen from '../../../components/ChatScreen'
import { auth, db } from '../../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '../../../components/getRecipientEmail'

function Chat({ chat, messages }) {
    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with { getRecipientEmail(chat.users, user) }</title>
            </Head>

            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat

// fetching data from database to server for pre rendering
export async function getServerSideProps(context){      // (Server-side Rendering) (context-help to fetch URL)
    const ref = db.collection("chats").doc(context.query.id);

    // prep messages on the server 
    const messagesRes = await ref.collection("messages").orderBy("timestamp", "asc").get();

    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    .map(messages => ({
       ...messages,
       timestamp: messages.timestamp.toDate().getTime()
   }));

    // prep the chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }
    
    return {
        props: {
           messages: JSON.stringify(messages),
           chat: chat
        }
    }

}


// Styling
const Container = styled.div`
    
`;

const ChatContainer = styled.div`
    flex:1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display:none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;