import Head from 'next/head'
import styled from 'styled-components'
import {Button} from '@material-ui/core'
import {auth, provider} from '../firebase'

function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert)
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Head>
            <LoginContainer>
                <SignInWith>
                    <h1>Sign-in using</h1>
                    <div>
                        <img onClick={signIn} src="/gmail.png" />
                        <p>Gmail</p>
                    </div>
                </SignInWith>

                <p>or</p>
                <p>Firstly</p>
                <Googlebtn>
                    <div class="google-btn">
                        <div class="google-icon-wrapper">
                            <img onClick={signIn} class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                        </div>
                        <p class="btn-text"><b>Sign Up with Gmail</b></p>
                    </div>
                </Googlebtn>
                
            </LoginContainer>

        </Container>
    )
}

export default Login;


const Container = styled.div`
    background-color: whitesmoke;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;

    

`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    height: 63vh;
    width: 30vw;

    > p {
        text-align: center;
        margin: 3px;
    }

    @media (max-width: 841px) {
         width: 55vw;
         height: 50vh;
  }

`;

const SignInWith = styled.div`

    height: 242px;
    text-align: center;
    border-bottom: 0.1px solid rgb(10 10 10 / 8%);
    > div > img {
        height: 100px;
        cursor: pointer;
    }
    > div > p {
        font-weight: 500;
    }

    > div {
        display: flex;
        align-items: center;
        flex-direction: column;
        height: 300;
    }

    > div > img:hover {
        -webkit-filter: drop-shadow(1px 1px 5px #732617);
        filter:         drop-shadow(1px 1px 5px #732617); 
    } 

    @media (max-width: 841px) {
        > div > img {
        height: 75px;
        }
        > h1 {
            font-size:25px;
        }

        height: 200px;
       
  }
`;

const Googlebtn = styled.div`
    margin: auto;
`;
