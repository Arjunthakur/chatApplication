import styled from 'styled-components'
import {Avatar} from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator'
import {auth, db} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import getRecipientEmail from './getRecipientEmail'
import { useState } from 'react'
import { useRouter } from 'next/router'
 

function Sidebar() {
    const router = useRouter();
    const [user] = useAuthState(auth);  // loged in user
    const userChatRef = db.collection("chats").where("users", "array-contains", user.email);
    const [chatsSnapshot] = useCollection(userChatRef)

    const createChat = () => {
        const input = prompt("Please enter an Email address for the user you wish to chat with");

        if(!input) return null;
        if(EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
            db.collection('chats').add({
                users: [user.email, input]
            })
        }
    }

    const chatAlreadyExists = (recieptEmail) =>
        !!chatsSnapshot?.docs.find((chat)=> chat.data().users.find((user) => user === recieptEmail)?.length > 0);

    
    const [search, setSearch] = useState('');     
    const onSearchChange = (event) => {
        setSearch(event.target.value);
    }

    const [click, setClick] = useState(false);
    const optionsBox = () => {
        setClick(!click);
    }


    const logOut = () => {
        router.push('/');
        auth.signOut();
    }
    return (
        <Container>
            <Header>
                <UserAvatar src={user?.photoURL} />

                <IconsContainer>
                    <Icons>
                        <MessageIcon />
                    </Icons>
                    <Icons>
                        <MoreVertIcon onClick={optionsBox} />
                    </Icons>

                    <div className={click ? 'active' : 'hidden'}>
                                <ul>
                                    <li className="disabled">Profile</li>
                                    <li className="disabled">Security</li>
                                    <li className="disabled">Help</li>
                                    <li className="disabled">Setting</li>
                                    <li onClick={logOut}>Log Out</li>
                                </ul>
                    </div>
   
                </IconsContainer>
            </Header>

            <Search> 
                <SearchIcon />
                <SearchInput onChange={ onSearchChange } placeholder='Search chats' />
            </Search>

            <SidebarButton onClick={ createChat }>
                START A NEW CHAT
            </SidebarButton>

            {chatsSnapshot?.docs.map((chat) => {
                const recipientEmail = getRecipientEmail(chat.data().users, user)

                if(search){
                    if(recipientEmail.includes(search)){
                        return <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    }else{
                        return
                    }
                }
                else{
                    return <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                }
            })}

        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    max-height: calc(100vh);
    overflow-y: auto;
    border-right: 1px solid whitesmoke;
    min-width: 300px;
    /* max-width: 350px; */

    ::-webkit-scrollbar {
    display: none;
    }
`;

const Header = styled.div`
    display:flex;
    position:sticky;
    top: 0;
    background-color:white;
    z-index: 1;
    justify-content: space-between;
    align-items:center;
    padding:15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor:pointer;
    :hover {
        opacity:0.8;
    }
`;

const IconsContainer = styled.div`
    
`;

const Search = styled.div`
    display:flex;
    align-items:center;
    padding:20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    outline-width: 0;
    border:none; 
    flex:1;
`;

const SidebarButton = styled.button`
    width: 100%;
    background: transparent;
    border:none;
    cursor: pointer;
    height:30px;
    font-weight: bold;
    border-bottom: 1px solid whitesmoke;
    border-top: 1px solid whitesmoke;
    

    :hover {
        background: rgba(0,0,0,0.05);
    }
`;



const Icons = styled.div`
    padding: 9px;
    display: inline-block;
    border-radius: 31px;
    cursor: pointer;
    
    :hover {
        background-color: whitesmoke;
    }
`;