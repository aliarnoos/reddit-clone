import './nav.css'
import {app} from '../../Firebase'
import {getAuth, signOut, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence} from 'firebase/auth'

export const auth = getAuth(app)
const provider = new GoogleAuthProvider()

type user = {
    userStatus: boolean
    accountInfo: string
    signInWithGoogle: () => void
    signOutGoogle: () => void
}

function NavBar({userStatus, accountInfo, signInWithGoogle, signOutGoogle}: user) {


    return ( 
        <nav>
            <img src="/imgs/reddit-logo.png" alt="logo" />
            <div className='account'>
                <div className='profile'>
                   {userStatus ? <img src='/imgs/profile.webp' alt="profile" />  : ''}
                    <h4>{accountInfo}</h4> 
                </div>
                <div>{!userStatus ?  
                    <button onClick={signInWithGoogle} className="login-with-google-btn" > Sign in</button> 
                   :<button onClick={signOutGoogle} className="login-with-google-btn" >Sign Out </button>}
                </div>
            </div>
        </nav>
     );
}

export default NavBar;
