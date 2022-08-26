import { onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { colRef, db } from "../AddPost/AddPost";
import Post from "../Post/Post";

function Borad() {
  const [posts, setPosts] = useState();
  const getPosts = () => {
    onSnapshot(colRef, (snapshot) => {
      let posts = [];
      snapshot.docs.forEach((doc) => {
        return posts.push({ ...doc.data(), id: doc.id });
      });
      console.log(posts);
      setPosts(
        posts.map((post) => {
          return (
            <Post
              title={post.title}
              url={post.url}
              text={post.text}
              user={post.user}
              key={post.id}
              handleDel={() => postDelete(post.id)}
            />
          );
        })
      );
    });
  };
  function postDelete(id) {
    const docRef = doc(db, "posts", id);
    deleteDoc(docRef);
  }
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <h1>main board</h1>
      <div>{posts}</div>
    </>
  );
}

export default Borad;
