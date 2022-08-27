import NavBar from "./components/NavBar/NavBar";
import './App.css'
import AddPost from "./components/AddPost/AddPost";
import { useState, useEffect, createContext } from "react";
import Borad from "./components/Board/Board";
import {getAuth, signOut, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence} from 'firebase/auth'
import {app} from './Firebase'

export const auth = getAuth(app)
const provider = new GoogleAuthProvider()

type user = {
    name: string
    state: boolean
}
export const userContext = createContext('')

function App() {

  const [userStatus, setUserStatus] = useState<user['state']>(false)
  const [accountInfo, setAccountInfo]  = useState<user['name']>('')

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
  .then(result => {
      const name = result.user.displayName || 'No User'
      console.log(name)
      localStorage.setItem('name', name)
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
      localStorage.setItem('name', '')
      setUserStatus(false)
      setAccountInfo('')
    }).catch((error) => {
      alert(error)
    });
}
auth.onAuthStateChanged((user) => {
  if (user) {
    setUserStatus(true)
  } 
  else if (!user) {
    setUserStatus(false)
  }
});
useEffect(()=>{
  const userName = localStorage.getItem('name') as string
  setAccountInfo(userName)
},[])
  return (
    <userContext.Provider value={accountInfo}>
    <div className="App">
    <NavBar userStatus={userStatus} accountInfo={accountInfo} signInWithGoogle={signInWithGoogle} signOutGoogle={signOutGoogle} />
      <div className="main">
         {!accountInfo ? <h1>Sign In to Post and comment </h1> : <AddPost/> }   
           <Borad/>
      </div>
    </div>
    </userContext.Provider>
  );
}

export default App;
