import { updateDoc, doc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import { db } from "../AddPost/AddPost";
import "./comment.css";
import {
  addDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

type commentProp = {
  text: string;
  time: string;
  user: string;
  votes: number;
  postId: number;
  id: string;
  handleDel: () => void;
};

type commentsState = {
  comments: JSX.Element[] | null;
};

function Comment({
  text,
  time,
  user,
  votes,
  postId,
  id,
  handleDel,
}: commentProp) {
  const [showReplyInput, setShowReplyInput] = useState(false);

  const userName = useContext(userContext);
  const date = new Date(time).toLocaleString();

  const upVote = (id: string) => {
    let docRef = doc(db, "comments", id);
    if (localStorage.getItem(`upvoted${id}`) === "true") {
      updateDoc(docRef, {
        votes: votes - 1,
      });
      localStorage.setItem(`upvoted${id}`, "false");
    } else if (!(localStorage.getItem(`upvoted${id}`) === "true")) {
      updateDoc(docRef, {
        votes: votes + 1,
      });
      localStorage.setItem(`upvoted${id}`, "true");
      localStorage.setItem(`downvoted${id}`, "false");
    }
  };

  const downVote = (id: string) => {
    let docRef = doc(db, "comments", id);
    if (localStorage.getItem(`downvoted${id}`) === "true") {
      updateDoc(docRef, {
        votes: votes + 1,
      });
      localStorage.setItem(`downvoted${id}`, "false");
    } else if (!(localStorage.getItem(`downvoted${id}`) === "true")) {
      updateDoc(docRef, {
        votes: votes - 1,
      });
      localStorage.setItem(`downvoted${id}`, "true");
      localStorage.setItem(`upvoted${id}`, "false");
    }
  };

  const [reply, setReply] = useState("");
  const commentRef = collection(db, "comments");
  const setReplyValue = () => {
    const inputComment = document.querySelector(
      ".commentReply"
    ) as HTMLInputElement;
    let text = inputComment.value;
    setReply(text);
  };
  const addReply = () => {
    console.log(reply);
    addDoc(commentRef, {
      text: reply,
      user: userName,
      votes: 1,
      time: Date(),
      createdAt: serverTimestamp(),
      commentId: id,
    });
    setShowReplyInput(false);
  };
  const commentDelete = (id: string) => {
    const docRef = doc(db, "comments", id);
    deleteDoc(docRef);

    const commentRefPost = query(
      collection(db, "comments"),
      where("commentId", "==", id)
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
  };
  const [replys, setReplys] = useState<commentsState["comments"]>();
  const getComments = () => {
    // setIsLoading(true);
    const commentRefPost = query(commentRef, where("commentId", "==", id));
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
            postId={comment.commentId}
            votes={comment.votes}
            time={comment.time}
            handleDel={() => commentDelete(comment.id)}
          />
        );
      });
      setReplys(commentsBox);
    });
    // setIsLoading(false);
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="comments-container">
      <div className={"comment-box"}>
        <div className="vote-sec">
          <button onClick={() => upVote(id)}>
            <img
              src={
                localStorage.getItem(`upvoted${id}`) === "true"
                  ? "/imgs/up-voted-icon.svg"
                  : "/imgs/up-icon.svg"
              }
              alt="up vote"
            />
          </button>
          <h3>{votes}</h3>
          <button onClick={() => downVote(id)}>
            <img
              src={
                localStorage.getItem(`downvoted${id}`) === "true"
                  ? "/imgs/down-voted-icon.svg"
                  : "/imgs/down-icon.svg"
              }
              alt="down vote"
            />
          </button>
        </div>
        <div className={" post-selected"}>
          <div className="comment-header">
            <span className="comment-profile">
              {" "}
              <img src="/imgs/profile.png" alt="profile" /> {user}{" "}
            </span>
            <span>on {date}</span>
          </div>
          <p>{text}</p>
          <div className="post-btns">
            {userName === user ? (
              <button onClick={handleDel}>
                <img src="/imgs/del-icon.svg" alt="delete icon" /> Delete
              </button>
            ) : (
              ""
            )}
            {userName ? (
              <button onClick={() => setShowReplyInput(true)}>
                <img src="/imgs/comment-icon.svg" alt="delete icon" /> Reply
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {showReplyInput ? (
        <div className="reply">
          <input
            type={text}
            name="comment"
            placeholder="What are your thoughts?"
            className="commentReply"
            onChange={setReplyValue}
          />
          <button onClick={addReply}>Comment</button>
          <button onClick={() => setShowReplyInput(false)}>cansel</button>
        </div>
      ) : (
        ""
      )}
      <div className="replay-box">{replys}</div>
    </div>
  );
}

export default Comment;
