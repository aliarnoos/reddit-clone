import NavBar from "./components/NavBar/NavBar";
import "./App.css";
import {
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
  collection,
  where,
} from "firebase/firestore";
import { useState, useEffect, createContext } from "react";
import Borad from "./components/Board/Board";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./Firebase";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostPage from "./PostPage/PostPage";
import { colRef, db } from "../src/components/AddPost/AddPost";
import Post from "./components/Post/Post";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

type user = {
  name: string;
  state: boolean;
};
type posts = {
  posts: JSX.Element[];
};
export const userContext = createContext("");

function App() {
  // const [showTopPost] = useState(false);
  const [currentPostId, setCurrentPostId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<posts["posts"]>();

  const orderByNew = query(colRef, orderBy("createdAt", "desc"));
  const orderByVote = query(colRef, orderBy("votes", "desc"));

  const [postInfo, setPostInfo] = useState({});
  const fetchPostInfo = (id: string) => {
    const postRef = doc(db, "posts", id);
    getDoc(postRef).then((doc) => {
      const docInfo = { ...doc.data(), id: doc.id };
      console.log(docInfo);
      setPostInfo(docInfo);
      setCurrentPostId(doc.id);
    });
  };

  let displayOrder = orderByNew;
  const getPosts = () => {
    onSnapshot(displayOrder, (snapshot) => {
      setIsLoading(true);
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
            selected={false}
            handleDel={() => postDelete(post.id)}
            fetchPostInfo={() => fetchPostInfo(post.id)}
          />
        );
      });
      setPosts(postsBox);
      setIsLoading(false);
    });
  };

  function postDelete(id: string) {
    const docRef = doc(db, "posts", id);
    deleteDoc(docRef);

    const commentRefPost = query(
      collection(db, "comments"),
      where("postId", "==", id)
    );
    onSnapshot(commentRefPost, (snapshot) => {
      let dbComments: {}[] = [];
      snapshot.docs.forEach((doc) => {
        return dbComments.push({ ...doc.data(), id: doc.id });
      });
      dbComments.map((comment: any) => {
        const docRef = doc(db, "comments", comment.id);
        deleteDoc(docRef);
      });
    });
  }

  const displayNewPosts = () => {
    // setShowTopPost(false);
    displayOrder = orderByNew;
    getPosts();
  };

  const displayTopPosts = () => {
    // setShowTopPost(true);
    displayOrder = orderByVote;
    getPosts();
  };
  useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, []);

  const [userStatus, setUserStatus] = useState<user["state"]>(false);
  const [accountInfo, setAccountInfo] = useState<user["name"]>("");

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const name = result.user.displayName || "No User";
        localStorage.setItem("name", name);
        setUserStatus(true);
        setAccountInfo(name);
      })
      .catch((error) => {
        alert(error);
      });
  };
  const signOutGoogle = () => {
    signOut(auth)
      .then(() => {
        localStorage.setItem("name", "");
        setUserStatus(false);
        setAccountInfo("");
      })
      .catch((error) => {
        alert(error);
      });
  };
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUserStatus(true);
    } else if (!user) {
      setUserStatus(false);
    }
  });
  useEffect(() => {
    const userName = localStorage.getItem("name") as string;
    setAccountInfo(userName);
  }, []);

  return (
    <BrowserRouter>
      <userContext.Provider value={accountInfo}>
        <div className="App">
          <NavBar
            userStatus={userStatus}
            accountInfo={accountInfo}
            signInWithGoogle={signInWithGoogle}
            signOutGoogle={signOutGoogle}
          />
          <div className="main">
            <Routes>
              <Route
                path="/"
                element={
                  <Borad
                    posts={posts}
                    isLoading={isLoading}
                    displayNewPosts={displayNewPosts}
                    displayTopPosts={displayTopPosts}
                  />
                }
              />
              <Route
                path="/postpage/:id"
                element={
                  <PostPage postInfo={postInfo} postID={currentPostId} />
                }
              />
            </Routes>
          </div>
        </div>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
