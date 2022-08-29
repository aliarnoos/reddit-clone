import { updateDoc, doc } from "firebase/firestore";
import { useContext, useState } from "react";
import { userContext } from "../../App";
import { db } from "../AddPost/AddPost";
import "./comment.css";

type commentProp = {
  text: string;
  time: string;
  user: string;
  votes: number;
  postId: number;
  id: string;
  handleDel: () => void;
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
  const [upVoted, setUpvoted] = useState(false);
  const [downVoted, setDownvoted] = useState(false);

  const userName = useContext(userContext);
  const date = new Date(time).toLocaleString();

  const upVote = (id: string) => {
    let docRef = doc(db, "comments", id);
    if (upVoted) {
      updateDoc(docRef, {
        votes: votes - 1,
      });
      setUpvoted(false);
    } else if (!upVoted) {
      updateDoc(docRef, {
        votes: votes + 1,
      });
      setUpvoted(true);
      setDownvoted(false);
    }
  };

  const downVote = (id: string) => {
    let docRef = doc(db, "comments", id);
    if (downVoted) {
      updateDoc(docRef, {
        votes: votes + 1,
      });
      setDownvoted(false);
    } else if (!downVoted) {
      updateDoc(docRef, {
        votes: votes - 1,
      });
      setDownvoted(true);
      setUpvoted(false);
    }
  };

  return (
    <div className="comments-container">
      <div className={"comment-box"}>
        <div className="vote-sec">
          <button onClick={() => upVote(id)}>
            <img
              src={upVoted ? "/imgs/up-voted-icon.svg" : "/imgs/up-icon.svg"}
              alt="up vote"
            />
          </button>
          <h3>{votes}</h3>
          <button onClick={() => downVote(id)}>
            <img
              src={
                downVoted ? "/imgs/down-voted-icon.svg" : "/imgs/down-icon.svg"
              }
              alt="down vote"
            />
          </button>
        </div>
        <div className={" post-selected"}>
          <div className="comment-header">
            <span className="comment-profile">
              {" "}
              <img src="/imgs/profile.webp" alt="profile" /> {user}{" "}
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
              <button>
                <img src="/imgs/comment-icon.svg" alt="delete icon" /> Reply
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
