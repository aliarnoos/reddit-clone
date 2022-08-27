import './AddPost.css'
import { getFirestore, collection, onSnapshot,addDoc, deleteDoc, doc, serverTimestamp} from 'firebase/firestore'
import { useContext, useState } from 'react'
import { userContext } from '../../App'

type userInfo ={
  accountInfo: string
}
export const db = getFirestore()
export const colRef = collection(db, 'posts')

function AddPost() {

  const userName = useContext(userContext)

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')


const handleTitile = (event: any) => {
  const target = event.target as HTMLInputElement;
  setTitle(()=> target.value)
}
const handleUrl = (event: any) => {
  const target = event.target as HTMLInputElement;
  setUrl(()=> target.value)
}
const handleText = (event: any) => {
  const target = event.target as HTMLInputElement;
  setText(()=> target.value)
}

const inputTitle = document.querySelector('.title') as HTMLInputElement;
const inputUrl = document.querySelector('.url') as HTMLInputElement;
const inputText = document.querySelector('.text') as HTMLInputElement;

  const addPostToDb = (e: any) => {
    e.preventDefault()
    addDoc(colRef, {
      title: title,
      url: url,
      text: text,
      user: userName,
      votes: 1,
      time: Date(),
      createdAt: serverTimestamp()
    })
    inputTitle.value = ''
    inputUrl.value = ''
    inputText.value =''
  }
    return ( 
        <div className='post-inputs'>
          <form action='POST' className='PostForm'>
            <input type="text" placeholder="Title" required onChange={handleTitile} className='title' />
            <input type="url" placeholder="Link" onChange={handleUrl}  className='url'/>
            <textarea  placeholder="Text(optional)" onChange={handleText} className='text' ></textarea>
            <div className='btns'>
              <button onClick={addPostToDb} className='add-post-btn'>Post</button>
            </div>
            </form>
        </div>
     );
}

export default AddPost;