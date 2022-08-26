import './nav.css'
import {app} from '../../Firebase'
import {getAuth, signOut, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence} from 'firebase/auth'
import { useState } from 'react';


function NavBar() {
    const [userStatus, setUserStatus] = useState(false)
    const [accountInfo, setAccountInfo]  = useState<any>()

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
// setPersistence(auth, browserSessionPersistence)
// .then(() => {
//     return  signInWithPopup;
//   })
//   .catch((error) => {
//     alert(error)
//   });
 const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then(result => {
        const name = result.user.displayName || 'No User'
        setUserStatus(true)
        setAccountInfo(name)
    })
    .catch((error)=> {
        alert(error)
    })
}
 const signOutGoogle = () => {
    signOut(auth).then(() => {
        console.log('signed out')
        setUserStatus(false)
        setAccountInfo('')
      }).catch((error) => {
        alert(error)
      });
}
auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('user is in')
    } else {
        console.log(' no user')
    }
  });

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
