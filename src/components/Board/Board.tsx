import { onSnapshot, deleteDoc, doc , query, orderBy} from "firebase/firestore";
import { useEffect, useState } from "react";
import { colRef, db } from "../AddPost/AddPost";
import Post from "../Post/Post";
import './board.css'
type posts ={
  posts: JSX.Element[]
}
function Borad() {

  const [showNewPost, setShowNewPost] = useState(true)

  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<posts['posts']>();

  const orderByNew = query(colRef, orderBy('createdAt', 'desc'))
  const orderByVote = query(colRef, orderBy('votes', 'desc'))

  const getPosts = () => {
    let displayOrder = showNewPost ? orderByNew : orderByVote
    onSnapshot(displayOrder, (snapshot) => {
      setIsLoading(true)
      let dbPosts: {}[] = [];
      snapshot.docs.forEach((doc) => {
        return dbPosts.push({ ...doc.data(), id: doc.id });
      });
      const postsBox = dbPosts.map((post: any) => {
        return (
          <Post
            title={post.title}
            url={post.url}
            text={post.text}
            user={post.user}
            key={post.id}
            id={post.id}
            votes={post.votes}
            time={post.time}
            handleDel={() => postDelete(post.id)}
          />
        );
      })
      setPosts(postsBox)
      setIsLoading(false)
      });
    };

  function postDelete(id: string) {
    const docRef = doc(db, "posts", id);
    deleteDoc(docRef);
  }
  const displayNewPosts = () => {
    setShowNewPost(true)
    getPosts()
  }

  const displayTopPosts = () => {
    setShowNewPost(false)
    getPosts()
  }
  useEffect(() => {
    getPosts();
  }, []);


  return (
    <>
      <div className="post-view">
        <button onClick={()=> displayNewPosts()}> <img src={showNewPost ? "/imgs/new-icon.svg" : "/imgs/new-n-icon.svg"} alt="new posts" />New</button>
        <button onClick={()=> displayTopPosts()} > <img src={showNewPost ? "/imgs/top-n-icon.svg" : "/imgs/top-icon.svg"} alt="top rank" />Top</button>
      </div>
      <div>{isLoading ? <div className="lds-dual-ring"></div>  : posts}</div>
    </>
  );
}

export default Borad;
