import { useContext, useState } from 'react'
import { userContext } from '../../App'
import {  updateDoc, doc} from 'firebase/firestore'
import { db } from '../AddPost/AddPost'
import './post.css'
type postInfo = {
    title: string
    url: string
    text: string
    user: string
    id: string
    handleDel: () => void
    votes: number
    time: any
}
function Post({title, url, text, user, handleDel, votes, time, id} : postInfo) {

    const [upVoted, setUpvoted] = useState(false)
    const [downVoted, setDownvoted] = useState(false)


    const userName = useContext(userContext)
    const date = new Date(time).toLocaleString()

    const upVote = (id: string) => {
        let docRef = doc(db, 'posts', id)
        if(upVoted) {
            updateDoc(docRef, {
                votes: votes-1
              })  
            setUpvoted(false)

        }
        else if (!upVoted) {
            updateDoc(docRef, {
                votes: votes+1
              })
              setUpvoted(true)
              setDownvoted(false)
        }
    }

    const downVote = (id: string) => {
        let docRef = doc(db, 'posts', id)
        if(downVoted) {
            updateDoc(docRef, {
                votes: votes+1
              })  
            setDownvoted(false)
        }
        else if (!downVoted) {
            updateDoc(docRef, {
                votes: votes-1
              })
              setDownvoted(true)
              setUpvoted(false)
        }
    }
    return ( 
        <div className='post-box'>
        <div className='vote-sec'>
            <button onClick={()=>upVote(id)}><img src={upVoted ?  "/imgs/up-voted-icon.svg" :  "/imgs/up-icon.svg" } alt="up vote" /></button>
            <h3>{votes}</h3>
            <button onClick={()=>downVote(id)}><img src={downVoted ?  "/imgs/down-voted-icon.svg" :  "/imgs/down-icon.svg" } alt="down vote" /></button>

        </div>
        <div className="post">
            <span>Posted by {user} on </span>
            <span>{date}</span>
            <h3>{title}</h3>
            <a href={url}>{url}</a>
            <p>{text}</p>
            <div className='post-btns'>
                {userName===user ? <button onClick={handleDel}> <img src="/imgs/del-icon.svg" alt="delete icon" /> Delete</button> : '' }
                {userName ? <button> <img src="/imgs/comment-icon.svg" alt="delete icon" /> Comment</button> : '' }
            </div>
        </div>
        </div>

     );
}

export default Post;