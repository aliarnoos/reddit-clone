import Post from "../components/Post/Post";
import {
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../App";
import "./post-page.css";
import { colRef, db } from "../components/AddPost/AddPost";
import Comment from "../components/Comment/Comment";

type props = {
  postInfo: any;
  postID: string;
};

type commentsState = {
  comments: JSX.Element[] | null;
};
function PostPage({ postInfo, postID }: props) {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [comments, setComments] = useState<commentsState["comments"]>();
  let navigate = useNavigate();

  function postDelete(id: string) {
    const docRef = doc(db, "posts", id);
    deleteDoc(docRef);
    navigate("/");
  }
  const userName = useContext(userContext);

  const inputComment = document.querySelector(
    ".commentInput"
  ) as HTMLInputElement;

  const handleComment = () => {
    setComment(() => inputComment.value);
  };
  const commentRef = collection(db, "comments");

  const addComment = () => {
    addDoc(commentRef, {
      text: comment,
      user: userName,
      votes: 1,
      time: Date(),
      createdAt: serverTimestamp(),
      postId: postInfo.id,
    });
    inputComment.value = "";
  };

  const commentDelete = (id: string) => {
    const docRef = doc(db, "comments", id);
    deleteDoc(docRef);
  };
  const getComments = () => {
    setComments(null);
    setIsLoading(true);
    const commentRefPost = query(commentRef, where("postId", "==", postID));
    onSnapshot(commentRefPost, (snapshot) => {
      let dbComments: {}[] = [];
      snapshot.docs.forEach((doc) => {
        return dbComments.push({ ...doc.data(), id: doc.id });
      });
      const commentsBox = dbComments.map((comment: any) => {
        return (
          <Comment
            text={comment.text}
            user={comment.user}
            key={comment.id}
            id={comment.id}
            postId={comment.postId}
            votes={comment.votes}
            time={comment.time}
            handleDel={() => commentDelete(comment.id)}
          />
        );
      });
      setComments(commentsBox);
    });
    setIsLoading(false);
  };
  useEffect(() => {
    getComments();
  }, [postID]);

  return (
    <>
      {isLoading ? <div className="lds-dual-ring"></div> : ""}
      <div className={isLoading ? "post-info hide" : "post-info"}>
        <Post
          title={postInfo.title}
          url={postInfo.url}
          text={postInfo.text}
          user={postInfo.user}
          key={postInfo.id}
          id={postInfo.id}
          votes={postInfo.votes}
          time={postInfo.time}
          selected={true}
          handleDel={() => postDelete(postInfo.id)}
          fetchPostInfo={() => "data"}
        />
        {!userName ? (
          <h2>Plaese Sign in to comment</h2>
        ) : (
          <div className="comment">
            <span>comment as {userName}</span>
            <textarea
              name="comment"
              placeholder="What are your thoughts?"
              className="commentInput"
              onChange={handleComment}
            ></textarea>
            <button onClick={addComment}>Comment</button>
          </div>
        )}

        {comments}
      </div>
    </>
  );
}

export default PostPage;
